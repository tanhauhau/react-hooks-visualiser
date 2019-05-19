import React from 'react';
import { Table, TableHeader, TableData } from './Table';
import { ObjectHover } from './ObjectHover';

export default function Context({ context, onContextChange }) {
  return (
    <Table>
      {Object.keys(context).map(key => (
        <React.Fragment key={key}>
          <TableHeader>
            <ObjectHover data={context[key]} />
          </TableHeader>
          <TableData>
            <ContentEditable
              value={context[key].value}
              onChange={value => onContextChange(key, value)}
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
