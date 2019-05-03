import ProxyObject from '../utils/ProxyObject';

export default function Data({ data }) {
  if (typeof data === 'function') {
    return `[[Function {${data.name}}]]`;
  }
  
  let rawData = data;
  if (data instanceof ProxyObject) {
    rawData = data.getValue();
  }
  return JSON.stringify(rawData);
}