// @flow

import React from 'react';
import styles from './App.module.scss';
import Editor from './components/Editor';
import EditorPanel from './components/EditorPanel';

import useBabel from './utils/useBabel';
import useCodeRunner from './utils/useCodeRunner';
import useHistory from './utils/useHistory';

const initialCode = `import { useState } from 'react';

export default function MyCounter({ foo }) {
  const bar = 1;
  const baz = '123';
  const qux = true;
  const quux = [1, '2', 3];
  const corge = {a:1,b:2};

  const [count, setCount] = useState(0);
  
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

  console.log(currentCodeState);

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
        <Editor
          code={code}
          onCodeChange={onCodeChange}
        />
      </div>
      <div className={styles.rightPanel}>
        {currentCodeState && currentCodeState.status === 'running' ? (
          <>
            <div>Component Name: {currentCodeState.componentName}</div>
            {currentCodeState.statementIndex === -1
              ? 'Please fill in the props value and press next to render it'
              : ''}

            <div>
              Scope:
              <ul>
                {Object.keys(currentCodeState.scope).map(key => (
                  <li key={key}>
                    {key}: {JSON.stringify(currentCodeState.scope[key])}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
