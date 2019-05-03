import React from 'react';
import { Table, TableHeader, TableData } from './Table';
import { ObjectHover } from './ObjectHover';

export default function Scope({ scope }) {
  return (
    <Table>
      {Object.keys(scope).map(key => (
        <React.Fragment key={key}>
          <TableHeader>{key}</TableHeader>
          <TableData>
            <ObjectHover data={scope[key]} />
          </TableData>
        </React.Fragment>
      ))}
    </Table>
  );
}
