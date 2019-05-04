import ProxyObject from '../utils/ProxyObject';
import ContextObject from '../utils/ContextObject';

export default function Data({ data }) {
  if (typeof data === 'function') {
    return `Function{${data.name || 'anonymous'}}`;
  }

  if (data instanceof ContextObject) {
    return `Context{${data.name}}`;
  }

  let rawData = data;
  if (data instanceof ProxyObject) {
    rawData = data.getValue();
  }

  if (data === undefined) {
    return 'undefined';
  }

  return JSON.stringify(rawData);
}
