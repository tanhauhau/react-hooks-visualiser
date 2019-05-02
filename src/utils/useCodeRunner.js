// @flow
/* eslint-disable no-new-func, no-loop-func */
import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import * as babel from './babel';
import Hook from './hook';
type Location = {
  line: number,
  column: number,
};
export type State = {|
  status: 'ready' | 'running' | 'pause',
  componentName: string,
  hooks: Hook,
  scope: {},
  props: {},
  statementAt: ?{ start: Location, end: Location },
|};

type Action =
  | {|
      type: 'start',
      ast: Object,
    |}
  | {|
      type: 'stop',
    |}
  | {|
      type: 'pause',
    |}
  | {||};

function codeRunnerReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start': {
      const { componentName, propNames, statements, scope } = analyseCode(
        action.ast
      );
      return {
        ...state,
        status: 'running',
        componentName,
        props: keysToObjects(propNames),
        scope,
        statements,
        statementIndex: -1,
      };
    }
    case 'next': {
      const nextStatementIndex =
        state.statementIndex === -1
          ? 0
          : state.statements[state.statementIndex].next;
      const nextStatement = state.statements[nextStatementIndex];
      console.log('nextStatement', nextStatementIndex, nextStatement);

      let statementAt = null;
      let { scope, hooks } = state;

      if (nextStatementIndex > -1) {
        statementAt = nextStatement.statement.loc;
        ({ scope, hooks } = executeStatement(
          nextStatement.statement,
          scope,
          hooks
        ));
      }

      return {
        ...state,
        statementIndex: nextStatementIndex,
        statementAt,
        scope,
        hooks,
      };
    }
    case 'updateHook': 
      console.log(action);
    default:
      return state;
  }
}

const initialState: State = {
  status: 'ready',
  componentName: '',
  hooks: new Hook(),
  scope: {},
  props: {},
  statementAt: null,
};

export default function useCodeRunner(): [State, (Action) => void] {
  const [state, dispatch] = useReducer(codeRunnerReducer, initialState);
  state.hooks.setDispatch(dispatch);
  return [state, dispatch];
}

function analyseCode(ast) {
  const componentFunction = tryFindComponentFunction(ast);
  if (componentFunction) {
    const componentName = getComponentName(componentFunction);
    const propNames = getProps(componentFunction);
    const statements = flattenStatements(componentFunction.body.body);
    const scope =
      componentFunction.params[0] &&
      componentFunction.params[0].type === 'ObjectPattern'
        ? keysToObjects(propNames)
        : {};
    return {
      componentName,
      propNames,
      statements,
      scope,
    };
  }
  return null;
}

function tryFindComponentFunction(ast) {
  const exportDefault = ast.program.body.filter(
    node => node.type === 'ExportDefaultDeclaration'
  )[0];
  if (exportDefault) {
    return exportDefault.declaration;
  }
  return null;
}
function getComponentName(ast) {
  return ast.id.name;
}
function getProps(ast) {
  const props = ast.params[0];
  if (props) {
    if (props.type === 'ObjectPattern') {
      return props.properties.map(property => {
        return property.key.name;
      });
    } else {
      // TODO: find
      console.error('please use destructuring');
    }
  }
  return [];
}

// TODO: infer props via referenced object type
// function findReferencedStatements(identifierName, statements) {
//   const redeclared =
//     statements
//       .filter(statement => statement.type === 'VariableDeclaration')
//       .reduce((result, statement) => result.concat(statement.declarations), [])
//       .filter(declaration => declaration.id.name === identifierName).length > 0;
//   if (redeclared) {
//     return [];
//   }
//   // TODO: tree traversal to find `MemberExpression` identifierName.xxx
//   return statements.map(statement => {
//     switch (statement.type) {
//       case 'VariableDeclaration':
//         return statement.declarations.filter(
//           declaration =>
//             declaration.init.type === 'Identifier' &&
//             declaration.init.name === identifierName
//         );
//       case ''
//     }
//   });
// }
function flattenStatements(statements) {
  const result = [];
  let i = 0;
  for (const statement of statements) {
    switch (statement.type) {
      case 'VariableDeclaration':
        statement.declarations.forEach(declaration =>
          result.push({
            statement: declaration,
            next: ++i,
          })
        );
        break;
      case 'ReturnStatement':
        result.push({
          statement,
          next: -1, // end
        });
        break;
      // TODO: handle if else
      default:
    }
  }
  return result;
}

function keysToObjects(keys) {
  const result = {};
  for (const key of keys) {
    result[key] = null;
  }
  return result;
}

function executeStatement(statement, scope, hooks: Hook) {
  const nextScope = { ...scope };
  const nextHook = hooks.clone();
  console.log('statement', statement);
  switch (statement.type) {
    case 'VariableDeclarator': {
      const value = evaluateExpression(statement.init, nextScope, nextHook);
      if (statement.id.type === 'Identifier') {
        nextScope[statement.id.name] = value;
      } else if (statement.id.type === 'ArrayPattern') {
        statement.id.elements.forEach((identifier, index) => {
          nextScope[identifier.name] = value[index];
        });
      }
      break;
    }
    case 'ReturnStatement':
      ReactDOM.render(
        evaluateExpression(statement.argument, nextScope, nextHook),
        document.querySelector('#render-here')
      );
      break;
    default:
  }
  return { scope: nextScope, hooks: nextHook };
}

function evaluateExpression(ast, scope, hook: Hook) {
  switch (ast.type) {
    case 'NumericLiteral':
    case 'StringLiteral':
    case 'BooleanLiteral':
    case 'ArrayExpression':
    case 'ObjectExpression':
      return dangerousEvalWithScope(babel.generate(ast).code, scope);
    case 'CallExpression':
      if (ast.callee.type === 'Identifier') {
        if (ast.callee.name === 'useState') {
          let initialState = undefined;
          if (ast.arguments.length > 0) {
            initialState = evaluateExpression(ast.arguments[0], scope, hook);
          }
          return hook.addUseState(initialState);
        }
      } else {
        return dangerousEvalWithScope(babel.generate(ast).code, scope);
      }
      return [];
    default:
  }
}

function dangerousEvalWithScope(code, scope) {
  return Function(
    'React',
    `{${Object.keys(scope).join(',')}}`,
    `return ${code}`
  )(React, scope);
}
