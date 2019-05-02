import React, { useContext, useReducer, useEffect } from 'react';
import styled from 'styled-components';
import randomcolor from 'randomcolor';

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
        [map.get(action.data)]: true
      };
    case 'unhover':
      return {
        ...state,
        [map.get(action.data)]: false
      };
    default:
      return state;
  }
};
const initialState = {};

export function FunctionHoverProvider({ children }) {
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

export function FunctionHover({ fn }) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const fnIndex = ensureMap(fn);

  return (
    <HoverDiv
      color={randomcolor({ luminosity: 'dark', seed: fnIndex * 10 })}
      highlight={state[fnIndex]}
      onMouseEnter={() => dispatch({ type: 'hover', data: fn })}
      onMouseLeave={() => dispatch({ type: 'unhover', data: fn })}
    >
      [[Function {fn.name}]]
    </HoverDiv>
  );
}
