import React from 'react';
import { ObjectHover } from './ObjectHover';

export default function Data({ data }) {
  switch (typeof data) {
    case 'function':
      return <ObjectHover data={data} />;
    default:
      return JSON.stringify(data);
  }
}
