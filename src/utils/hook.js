// @flow
import ProxyObject from './ProxyObject';

export default class Hook {
  constructor() {
    this.hooks = [];
    this.hookPointer = -1;
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch;
  }

  add_useState(initialState) {
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

  update_useState(hookIndex, { value: newValue }) {
    const hook = this.hooks[hookIndex];
    let nextState;
    if (typeof newValue === 'function') {
      nextState = hook.state.setValue(newValue(hook.state.getValue()));
    } else {
      nextState = hook.state.setValue(newValue);
    }
    this.hooks[hookIndex] = {
      ...hook,
      state: nextState,
    };
  }

  add_useReducer(reducer, initialArg, init) {
    this.hookPointer++;
    if (this.hooks[this.hookPointer] !== undefined) {
      const { state, dispatch } = this.hooks[this.hookPointer];
      return [state, dispatch];
    }

    const state =
      typeof init === 'function'
        ? new ProxyObject(init(initialArg.getValue()))
        : initialArg;

    const dispatch = action => {
      this.dispatch({
        type: 'updateHook',
        hookType: 'useReducer',
        hookIndex: this.hookPointer,
        data: { action },
      });
    };
    this.hooks.push({
      type: 'useReducer',
      state,
      dispatch,
      reducer,
    });
    return [state, dispatch];
  }

  update_useReducer(hookIndex, { action }) {
    const hook = this.hooks[hookIndex];

    let nextState = hook.state.setValue(
      hook.reducer(hook.state.getValue(), action)
    );

    this.hooks[hookIndex] = {
      ...hook,
      state: nextState,
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
