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
        <Hook key={index} active={index === hookPointer} hook={hook} />
      ))}
    </HooksContainer>
  );
}

function Hook({ hook, active, children }) {
  return (
    <>
      <HookArrow> ⇣ </HookArrow>
      <HookDiv>
        {active && <HookRightArrow>⇢</HookRightArrow>}
        <HookTitleDiv>{hook.type}</HookTitleDiv>
        <HookBody>
          <HookData hook={hook} />
        </HookBody>
      </HookDiv>
    </>
  );
}

const HOOK_DATA_MAP = {
  useState: HookUseState,
  useReducer: HookUseReducer,
  useCallback: HookUseCallback,
  useMemo: HookUseMemo,
};

function HookData({ hook }) {
  const HookDataComponent = HOOK_DATA_MAP[hook.type];
  if (HookDataComponent) {
    return <HookDataComponent hook={hook} />;
  }
  return null;
}

function HookUseState({ hook }) {
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
}

function HookUseReducer({ hook }) {
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
}

function HookUseCallback({ hook }) {
  const { callback, deps } = hook;
  return (
    <>
      <Table>
        <TableHeader>Callback</TableHeader>
        <TableData>
          <ObjectHover data={callback} />
        </TableData>
        <TableHeader>Deps</TableHeader>
        <TableData>
          {'['}
          {deps.map((dep, index) => (
            <>
              {index > 0 ? ',' : null}
              <ObjectHover data={dep} />
            </>
          ))}
          {']'}
        </TableData>
      </Table>
    </>
  );
}

function HookUseMemo({ hook }) {
  const { memoised, deps } = hook;
  return (
    <>
      <Table>
        <TableHeader>Memoised</TableHeader>
        <TableData>
          <ObjectHover data={memoised} />
        </TableData>
        <TableHeader>Deps</TableHeader>
        <TableData>
          {'['}
          {deps.map((dep, index) => (
            <>
              {index > 0 ? ',' : null}
              <ObjectHover data={dep} />
            </>
          ))}
          {']'}
        </TableData>
      </Table>
    </>
  );
}
