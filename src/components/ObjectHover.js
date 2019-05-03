import React, { useContext, useReducer } from 'react';
import styled from 'styled-components';
import randomcolor from 'randomcolor';
import ProxyObject from '../utils/ProxyObject';
import Data from './Data';

const DispatchContext = React.createContext();
const StateContext = React.createContext();

const map = new WeakMap();
let index = 0;

function ensureMap(fn) {
  if (!map.has(fn)) {
    map.set(fn, index++);
  }
  return map.get(fn);
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'hover':
      return {
        ...state,
        [map.get(action.data)]: true,
      };
    case 'unhover':
      return {
        ...state,
        [map.get(action.data)]: false,
      };
    default:
      return state;
  }
};
const initialState = {};

export function ObjectHoverProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
}

const HoverDiv = styled.div`
  color: ${props => (props.highlight ? 'white' : props.color)};
  background: ${props => (props.highlight ? props.color : 'transparent')};
  display: inline-block;
  cursor: pointer;
`;

export function ObjectHover({ data }) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  if (!isHoverable(data)) {
    return <Data data={data} />;
  }

  const fnIndex = ensureMap(data);

  return (
    <HoverDiv
      color={randomcolor({ luminosity: 'dark', seed: fnIndex * 10 })}
      highlight={state[fnIndex]}
      onMouseEnter={() => dispatch({ type: 'hover', data: data })}
      onMouseLeave={() => dispatch({ type: 'unhover', data: data })}
    >
      <Data data={data} />
    </HoverDiv>
  );
}

function isHoverable(data) {
  return typeof data === 'function' || data instanceof ProxyObject;
}
