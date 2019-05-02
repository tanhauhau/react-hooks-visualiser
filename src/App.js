// @flow

import React, { useMemo } from 'react';
import styles from './App.module.scss';
import Editor from './components/Editor';
import EditorPanel from './components/EditorPanel';
import { FunctionHoverProvider } from './components/Function';
import Data from './components/Data';
import Hooks from './components/Hooks';
import Scope from './components/Scope';

import useBabel from './utils/useBabel';
import useCodeRunner from './utils/useCodeRunner';
import useHistory from './utils/useHistory';

const initialCode = `import { useState } from 'react';

export default function MyCounter({ foo }) {
  const [count, setCount] = useState(0);
  const [p, setP] = useState('dragon');
  const [q, setQ] = useState(true);

  const bar = 1;
  const baz = '123';
  const qux = true;
  const quux = [1, '2', 3];
  const corge = {a:1,b:2};

  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Click</button>
      <div>{count}</div>
    </div>
  )
}`;

function App() {
  const [code, ast, error, onCodeChange] = useBabel(initialCode);
  const [codeState, dispatchCodeAction] = useCodeRunner();
  const [currentCodeState] = useHistory(codeState);

  const marker = useMemo(() => {
    if (currentCodeState && currentCodeState.statementAt) {
      const { start, end } = currentCodeState.statementAt;
      return [
        {
          startRow: start.line - 1,
          startCol: start.column,
          endRow: end.line - 1,
          endCol: end.column,
          className: 'highlight-marker',
          type: 'background',
        },
      ];
    }
    return [];
  }, [currentCodeState]);

  console.log(ast);

  return (
    <div className={styles.app}>
      <div className={styles.leftPanel}>
        <EditorPanel
          running={
            currentCodeState ? currentCodeState.status === 'running' : false
          }
          onRun={() => dispatchCodeAction({ type: 'start', ast })}
          onNext={() => dispatchCodeAction({ type: 'next' })}
        />
        <Editor code={code} onCodeChange={onCodeChange} marker={marker} />
      </div>
      <div className={styles.rightPanel}>
        {currentCodeState && currentCodeState.status === 'running' ? (
          <FunctionHoverProvider>
            <div>Component Name: {currentCodeState.componentName}</div>
            {currentCodeState.statementIndex === -1
              ? 'Please fill in the props value and press next to render it'
              : ''}

            <div>
              Scope:
              <Scope scope={currentCodeState.scope} />
            </div>
            <Hooks hook={currentCodeState.hooks} />
          </FunctionHoverProvider>
        ) : null}
        <div id="render-here" />
      </div>
    </div>
  );
}

export default App;
