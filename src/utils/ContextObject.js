export default class ContextObject {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  setValue(value) {
    return new ContextObject(this.name, value);
  }
}