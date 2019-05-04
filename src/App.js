// @flow

import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import SplitPane from 'react-split-pane';
import styles from './App.module.scss';
import Editor from './components/Editor';
import EditorPanel from './components/EditorPanel';
import { ObjectHoverProvider } from './components/ObjectHover';
import Hooks from './components/Hooks';
import Scope from './components/Scope';
import Props from './components/Props';
import History from './components/History';
import { Tabs, Tab } from './components/Tab';

import useBabel from './utils/useBabel';
import useCodeRunner from './utils/useCodeRunner';
import useHistory from './utils/useHistory';

const initialCode = `
function reducer(state, action) {
  if (action === 'increment') {
    return state + 1;
  } else if (action === 'decrement') {
    return state - 1;
  }
  return state;
}

export default function MyCounter({ foo }) {
  const [a, dispatch] = useReducer(reducer, 0);
  const [b, setB] = useState(0);
  const result = a * b;
  
  return (
    <div>
      <div>{'A: '}
      <button onClick={() => dispatch('increment')}>increment</button>
      <button onClick={() => dispatch('decrement')}>decrement</button>
      </div>
      <div>{'B: '}
      <button onClick={() => setB(b+1)}>increment</button>
      <button onClick={() => setB(b-1)}>decrement</button>
      </div>
      <div>{a} * {b} = {result}</div>
    </div>
  )
}`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  flex: 1;
`;
const ScrollableContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  overflow: scroll;
`;
const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const Header = styled.div`
  text-align: center;
  margin: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid gray;
`;

function App() {
  const [code, ast, error, onCodeChange] = useBabel(initialCode);
  const [codeState, dispatchCodeAction] = useCodeRunner();
  const [currentCodeState, codeStateHistory] = useHistory(codeState);

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
    <SplitPane split="vertical" defaultSize="45%">
      <Container>
        <EditorPanel
          running={
            currentCodeState ? currentCodeState.status === 'running' : false
          }
          nextText={
            currentCodeState && currentCodeState.statementIndex === -1
              ? 'Render'
              : 'Next'
          }
          nextHint={
            currentCodeState && currentCodeState.isComponentDirty === true
              ? 'Scheduled a re-render'
              : null
          }
          disableRun={!!error}
          onRun={() => dispatchCodeAction({ type: 'start', ast })}
          onNext={() => dispatchCodeAction({ type: 'next' })}
          onReset={() => dispatchCodeAction({ type: 'reset' })}
        />
        <Editor
          code={code}
          onCodeChange={onCodeChange}
          markers={marker}
          readOnly={currentCodeState && currentCodeState.status === 'running'}
        />
      </Container>
      <VerticalContainer>
        {currentCodeState && currentCodeState.status === 'running' ? (
          <ObjectHoverProvider>
            <Header>
              <div>Component Name: {currentCodeState.componentName}</div>
            </Header>
            <Container>
              <SplitPane split="horizontal" defaultSize="70%">
                <SplitPane split="vertical" defaultSize="50%">
                  <SplitPane
                    split="horizontal"
                    defaultSize="50%"
                    style={{ overflow: 'auto' }}
                  >
                    <ScrollableContainer>
                      <Header>Props</Header>
                      <Props
                        props={currentCodeState.props}
                        onPropsChange={(key, value) => {
                          dispatchCodeAction({
                            type: 'updateProps',
                            key,
                            value,
                          });
                        }}
                      />
                    </ScrollableContainer>
                    <Container>
                      <Header>Scope</Header>
                      <Scope scope={currentCodeState.scope} />
                    </Container>
                  </SplitPane>
                  <div>
                    <Hooks hook={currentCodeState.hooks} />
                  </div>
                </SplitPane>
                <Tabs>
                  <Tab name="Output">
                    <div id="render-here" />
                  </Tab>
                  <Tab name="Logs">
                    <History history={codeStateHistory} />
                  </Tab>
                </Tabs>
              </SplitPane>
            </Container>
          </ObjectHoverProvider>
        ) : null}
      </VerticalContainer>
    </SplitPane>
  );
}

export default App;
