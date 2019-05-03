import React from 'react';
import styled from 'styled-components';
import { ObjectHover } from './ObjectHover';
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
      {hooks.map((hook, index) => (
        <Hook
          key={index}
          showArrow={index > 0}
          active={index === hookPointer}
          name={hook.type}
        >
          <HookData hook={hook} />
        </Hook>
      ))}
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

function HookData({ hook }) {
  switch (hook.type) {
    case 'useState':
      return (
        <Table>
          <TableHeader>state</TableHeader>
          <TableData>
            <ObjectHover data={hook.state} />
          </TableData>
          <TableHeader>setState</TableHeader>
          <TableData>
            <ObjectHover data={hook.setState} />
          </TableData>
        </Table>
      );
    case 'useReducer':
      return (
        <Table>
          <TableHeader>state</TableHeader>
          <TableData>
            <ObjectHover data={hook.state} />
          </TableData>
          <TableHeader>reducer</TableHeader>
          <TableData>
            <ObjectHover data={hook.reducer} />
          </TableData>
          <TableHeader>dispatch</TableHeader>
          <TableData>
            <ObjectHover data={hook.dispatch} />
          </TableData>
        </Table>
      );
    default:
      return null;
  }
}
