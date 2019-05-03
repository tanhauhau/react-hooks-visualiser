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
  position: relative;
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
const HookRightArrow = styled.div`
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 5px;
`;

export default function Hooks({ hook }) {
  const { hooks, hookPointer } = hook;
  return (
    <HooksContainer>
      {hooks.map((hook, index) => {
        switch (hook.type) {
          case 'useState':
            return (
              <Hook
                key={index}
                showArrow={index > 0}
                active={index === hookPointer}
                name={hook.type}
              >
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
              </Hook>
            );
          default:
            return null;
        }
      })}
    </HooksContainer>
  );
}

function Hook({ name, showArrow, active, children }) {
  return (
    <>
      {showArrow ? <HookArrow> ⇣ </HookArrow> : null}
      <HookDiv>
        {active && <HookRightArrow>⇢</HookRightArrow>}
        <HookTitleDiv>{name}</HookTitleDiv>
        <HookBody>{children}</HookBody>
      </HookDiv>
    </>
  );
}
