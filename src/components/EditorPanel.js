// @flow
import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;
  cursor: pointer;
  outline: none;

  :hover {
    background: palevioletred;
    color: white;
  }
`;

const Container = styled.div`
  padding: 8px 16px;
`;

export default function EditorPanel({
  running,
  onRun,
  onStop,
  onReset,
  onNext
}) {
  return (
    <Container>
      {running ? (
        <Button onClick={onStop}>{'Stop'}</Button>
      ) : (
        <Button onClick={onRun}>{'Run'}</Button>
      )}
      <Button onClick={onReset}>{'Reset'}</Button>
      {running && <Button onClick={onNext}>{'Next'}</Button>}
      {/* <Button>{'Prev'}</Button> */}
    </Container>
  );
}
