import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Table, TableHeader, TableData } from './Table';
import { ObjectHover } from './ObjectHover';

const Header = styled.div`
  padding: 4px;
  text-align: center;
`;

export default function Scope({ scopes }) {
  const lastScope = scopes.length - 1;
  const [scopeIndex, setScopeIndex] = useState(lastScope);
  const scope = scopes[scopeIndex];

  useEffect(() => {
    setScopeIndex(lastScope);
  }, [lastScope]);

  return (
    <>
      <Header>
        <select
          value={scopeIndex}
          onChange={e => setScopeIndex(e.target.value)}
        >
          {scopes.map((_, index) => (
            <option key={index} value={index}>
              {index === lastScope ? 'Current Scope' : `Scope ${index}`}
            </option>
          ))}
        </select>
      </Header>
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
    </>
  );
}
