// @flow

import React from 'react';
import styles from './App.scss';
import useBabel from './utils/useBabel';
import Editor from './components/Editor';
console.log(styles);
function App() {
  const [code, ast, error, onCodeChange] = useBabel('');
  console.log(ast);
  return (
    <div className={styles.app}>
      <div className={styles.leftPanel}>
        <Editor code={code} onCodeChange={onCodeChange} />
      </div>
    </div>
  );
}

export default App;
