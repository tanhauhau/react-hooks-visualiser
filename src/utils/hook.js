// @flow

export default class Hook {
  constructor() {
    this.hooks = [];
    this.hookPointer = -1;
  }

  addUseState(initialState) {
    this.hookPointer++;
    const state = initialState;
    const setState = value => this.updateHook(this.hookPointer, value);
    this.hooks.push({
      type: 'useState',
      state,
      setState
    });
    return [state, setState];
  }

  updateHook(hookIndex, ...args) {
    const hook = this.hooks[hookIndex];
    switch (hook.type) {
      case 'useState':
        hook.state = args[0];
        break;
      default:
    }
  }

  clone() {
    const hook = new Hook();
    hook.hooks = [...this.hooks];
    hook.hookPointer = this.hookPointer;
    return hook;
  }
}
