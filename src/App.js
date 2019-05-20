// @flow

import React, { useMemo, useEffect } from 'react';
import styled from 'styled-components';
import SplitPane from 'react-split-pane';
import Editor from './components/Editor';
import EditorPanel from './components/EditorPanel';
import { ObjectHoverProvider } from './components/ObjectHover';
import Hooks from './components/Hooks';
import Effects from './components/Effect';
import Scope from './components/Scope';
import Props from './components/Props';
import Context from './components/Context';
import History from './components/History';
import { Tabs, Tab } from './components/Tab';

import useBabel from './utils/useBabel';
import useCodeRunner from './utils/useCodeRunner';
import useHistory from './utils/useHistory';

const { code: initialCode = '' } = parseQueryParams();

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  flex: 1;
`;
const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const Header = styled.div`
  text-align: center;
  padding: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

function App() {
  const [code, ast, error, onCodeChange] = useBabel(initialCode);
  const [codeState, dispatchCodeAction] = useCodeRunner();
  const [currentCodeState, codeStateHistory, clearHistory] = useHistory(
    codeState
  );

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

  useQueryParams(code);

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
          onReset={() => {
            dispatchCodeAction({ type: 'reset' });
            clearHistory();
          }}
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
              <SplitPane split="horizontal" defaultSize="60%">
                <SplitPane split="vertical" defaultSize="50%">
                  <Tabs>
                    <Tab name="Scope">
                      <Scope scopes={currentCodeState.scopes} />
                    </Tab>
                    <Tab name="Props">
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
                    </Tab>
                    <Tab name="Context">
                      <Context
                        context={currentCodeState.context}
                        onContextChange={(key, value) => {
                          dispatchCodeAction({
                            type: 'updateContext',
                            key,
                            value,
                          });
                        }}
                      />
                    </Tab>
                  </Tabs>
                  <Tabs>
                    <Tab name="Hooks">
                      <Hooks hook={currentCodeState.hooks} />
                    </Tab>
                    <Tab name="Effects">
                      <Effects effects={currentCodeState.hooks.effects} />
                    </Tab>
                  </Tabs>
                </SplitPane>
                <Tabs>
                  <Tab name="Logs">
                    <History history={codeStateHistory} />
                  </Tab>
                  <Tab name="Output">
                    <div id="render-here">{currentCodeState.output}</div>
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

function useQueryParams(code) {
  useEffect(() => {
    window.location.hash = `?code=${encodeURIComponent(code)}`;
  }, [code]);
}

function parseQueryParams() {
  return window.location.hash
    .substring(1)
    .split('&')
    .map(part => part.split('='))
    .reduce((result, parts) => {
      result[parts[0]] = decodeURIComponent(parts[1]);
      return result;
    }, {});
}

export default App;
