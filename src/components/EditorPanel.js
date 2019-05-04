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
  
  &[disabled] {
    color: gray;
    border-color: gray;
    background: white;
    cursor: not-allowed;
  }
`;

const Container = styled.div`
  padding: 8px 16px;
`;
const HintText = styled.span`
  color: palevioletred;
  font-size: 0.8em;
  ::before {
    content: '*'
  }
`;

export default function EditorPanel({
  disableRun,
  running,
  onRun,
  onReset,
  onNext,
  nextText,
  nextHint
}) {
  return (
    <Container>
      {running ? (
        <Button onClick={onReset}>{'Reset'}</Button>
      ) : (
        <Button onClick={onRun} disabled={disableRun}>{'Run'}</Button>
      )}
      {running && (
        <>
          <Button onClick={onNext}>{nextText}</Button>
          {nextHint && <HintText>{nextHint}</HintText>}
        </>
      )}
    </Container>
  );
}
