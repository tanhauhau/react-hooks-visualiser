import React from 'react';
import styled from 'styled-components';
import { FunctionHover } from './Function';
import Data from './Data';
import { Table, TableHeader, TableData } from './Table';

const HooksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const HookDiv = styled.div`
  border: 1px solid forestgreen;
  border-radius: 4px;
  display: inline-block;
`;
const HookTitleDiv = styled.div`
  background: forestgreen;
  color: white;
  padding: 4px;
`;
const HookBody = styled.div`
  padding: 4px;
`;
const HookArrow = styled.div`
  color: forestgreen;
`;

export default function Hooks({ hook }) {
  const { hooks, hookPointer } = hook;
  return (
    <HooksContainer>
      {hooks.map((hook, index) => {
        switch (hook.type) {
          case 'useState':
            return (
              <>
                {index > 0 ? <HookArrow> ⇣ </HookArrow> : null}
                <HookDiv>
                  <HookTitleDiv>useState</HookTitleDiv>
                  <HookBody>
                    <Table>
                      <TableHeader>state</TableHeader>
                      <TableData>
                        <Data data={hook.state} />
                      </TableData>
                      <TableHeader>setState</TableHeader>
                      <TableData>
                        <FunctionHover fn={hook.setState} />
                      </TableData>
                    </Table>
                  </HookBody>
                </HookDiv>
              </>
            );
          default:
            return null;
        }
      })}
    </HooksContainer>
  );
}
