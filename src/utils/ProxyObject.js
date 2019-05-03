// @flow

export default class ProxyObject {
  constructor(data) {
    this.data = data;
  }
  getValue() {
    return this.data;
  }
  setValue(newData) {
    if (newData !== this.data) {
      return new ProxyObject(newData);
    }
    return this;
  }
}
