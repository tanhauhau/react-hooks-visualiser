import React from 'react';
import styled from 'styled-components';
import { ObjectHover } from './ObjectHover';

const Effect = styled.div`
  border-radius: 4px;
  border: 1px solid black;
`;

export default function Effects({ effects }) {
  return effects.map((effect, idx) => (
    <Effect key={idx}>
      <ObjectHover data={effect.callback} />
    </Effect>
  ));
}
