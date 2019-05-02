import React, { useContext, useReducer, useEffect } from 'react';
import styled from 'styled-components';

const DispatchContext = React.createContext();
const StateContext = React.createContext();

const map = new WeakMap();
let index = 0;

const reducer = (state, action) => {
  switch (action.type) {
    case 'create':
      if (!map.has(action.data)) {
        map.set(action.data, index++);
      }
      return state;
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

export function FunctionHoverProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
}

const HoverDiv = styled.div`
  padding: 4px 8px;
  color: ${props => (props.highlight ? 'white' : '#8b679b')};
  background: ${props => (props.highlight ? '#8b679b' : 'transparent')};
  display: inline-block;
  cursor: pointer;
  border-radius: 4px;
`;

export function FunctionHover({ fn }) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  useEffect(() => {
    dispatch({ type: 'create', data: fn });
  }, [fn, dispatch]);

  return (
    <HoverDiv
      highlight={state[map.get(fn)]}
      onMouseEnter={() => dispatch({ type: 'hover', data: fn })}
      onMouseLeave={() => dispatch({ type: 'unhover', data: fn })}
    >
      [[Function {fn.name}]]
    </HoverDiv>
  );
}
