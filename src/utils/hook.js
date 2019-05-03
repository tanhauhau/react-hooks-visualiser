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
    if (this.hooks[this.hookPointer] !== undefined) {
      const { state, setState } = this.hooks[this.hookPointer];
      return [state, setState];
    }
    const state = initialState;
    const setState = value => {
      this.dispatch({
        type: 'updateHook',
        hookType: 'useState',
        hookIndex: this.hookPointer,
        data: { value }
      });
    };
    this.hooks.push({
      type: 'useState',
      state,
      setState
    });
    return [state, setState];
  }

  updateSetState(hookIndex, newValue) {
    const hook = this.hooks[hookIndex];
    let nextState;
    if (typeof newValue === 'function') {
      nextState = newValue(hook.state);
    } else {
      nextState = newValue;
    }
    this.hooks[hookIndex] = {
      ...hook,
      state: nextState
    };
  }

  clone() {
    const hook = new Hook();
    hook.hooks = [...this.hooks];
    hook.hookPointer = this.hookPointer;
    hook.dispatch = this.dispatch;
    return hook;
  }
}
