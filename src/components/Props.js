import React from 'react';
import { Table, TableHeader, TableData } from './Table';
import { ObjectHover } from './ObjectHover';

export default function Props({ props, onPropsChange }) {
  return (
    <Table>
      {Object.keys(props).map(key => (
        <React.Fragment key={key}>
          <TableHeader>{key}</TableHeader>
          <TableData>
            <ContentEditable
              value={props[key]}
              onChange={value => onPropsChange(key, value)}
            />
          </TableData>
        </React.Fragment>
      ))}
    </Table>
  );
}

function ContentEditable({ value, onChange }) {
  const onInput = e => {
    const newValue = tryParse(e.target.textContent);
    if (newValue !== value) {
      onChange(newValue);
    }
  };
  return (
    <div
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={onInput}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          e.preventDefault();
          e.target.blur();
        }
      }}
    >
      <ObjectHover data={value} />
    </div>
  );
}

function tryParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}
