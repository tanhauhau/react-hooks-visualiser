import React from 'react';
import { Table, TableHeader, TableData } from './Table';
import Data from './Data';

export default function Scope({ scope }) {
  return (
    <Table>
      {Object.keys(scope).map(key => (
        <React.Fragment key={key}>
          <TableHeader>{key}</TableHeader>
          <TableData>
            <Data data={scope[key]} />
          </TableData>
        </React.Fragment>
      ))}
    </Table>
  );
}
