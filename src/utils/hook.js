// @flow

export default class Hook {
  constructor() {
    this.hooks = [];
    this.hookPointer = -1;
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch;
  }

  addUseState(initialState) {
    this.hookPointer++;
    const state = initialState;
    const setState = (value) => {
      this.dispatch({
        type: 'updateHook',
        hookType: 'useState',
        hookIndex: this.hookPointer,
        data: { value },
      });
    };
    this.hooks.push({
      type: 'useState',
      state,
      setState,
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
