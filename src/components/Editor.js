// @flow
import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';

type PropTypes = {
  code: string,
  onCodeChange: string => void,
};
export default function Editor({ code, onCodeChange, marker }: PropTypes) {
  return (
    <AceEditor
      mode="javascript"
      theme="github"
      width="100%"
      height="100%"
      onChange={onCodeChange}
      name="code"
      value={code}
      showPrintMargin={false}
      editorProps={{ $blockScrolling: true }}
      setOptions={{ useWorker: false }}
      markers={marker}
      // onCursorChange={onCursorChange}
    />
  );
}
