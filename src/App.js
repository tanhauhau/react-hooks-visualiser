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
      <button onClick={() => setCount(count => count + 1)}>Click</button>
      <div>{count}</div>
    </div>
  )
}`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
`;
const ScrollableContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  overflow: scroll;
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
          type: 'background'
        }
      ];
    }
    return [];
  }, [currentCodeState]);

  console.log(ast);

  return (
    <SplitPane split="vertical" defaultSize="50%">
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
      <Container>
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
                    style={{ overflow: 'scroll' }}
                  >
                    <ScrollableContainer>
                      <Header>Props</Header>
                      <Props
                        props={currentCodeState.props}
                        onPropsChange={(key, value) => {
                          dispatchCodeAction({
                            type: 'updateProps',
                            key,
                            value
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
                <div id="render-here" />
              </SplitPane>
            </Container>
          </ObjectHoverProvider>
        ) : null}
      </Container>
    </SplitPane>
  );
}

export default App;
