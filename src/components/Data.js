import React from 'react';
import { FunctionHover } from './Function';

export default function Data({ data }) {
  switch (typeof data) {
    case 'function':
      return <FunctionHover fn={data} />;
    default:
      return JSON.stringify(data);
  }
}
