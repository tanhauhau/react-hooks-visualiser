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

  add_useState(initialState, logs) {
    this.hookPointer++;
    if (this.hooks[this.hookPointer] !== undefined) {
      const { state, setState } = this.hooks[this.hookPointer];

      logs.push({ type: 'hooks/useState', isInitial: false, state, setState });

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

    logs.push({ type: 'hooks/useState', isInitial: true, state, setState });

    return [state, setState];
  }

  update_useState(hookIndex, { value: newValue }, logs) {
    const hook = this.hooks[hookIndex];
    let nextState;
    let oldValue = hook.state;
    if (typeof newValue === 'function') {
      nextState = hook.state.setValue(newValue(oldValue.getValue()));
    } else {
      nextState = hook.state.setValue(newValue);
    }

    logs.push({ type: 'update/useState', oldValue, newValue: nextState });

    this.hooks[hookIndex] = {
      ...hook,
      state: nextState,
    };
  }

  add_useReducer(reducer) {
    this.hookPointer++;

    // optional arguments
    const initialArg = arguments.length > 2 ? arguments[1] : undefined;
    const init = arguments.length > 3 ? arguments[2] : undefined;
    // logs is always the last argument, because other args can be optional
    const logs = arguments[arguments.length - 1];

    if (this.hooks[this.hookPointer] !== undefined) {
      const { state, dispatch } = this.hooks[this.hookPointer];

      logs.push({
        type: 'hooks/useReducer',
        isInitial: false,
        state,
        dispatch,
      });

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

    logs.push({
      type: 'hooks/useReducer',
      isInitial: true,
      state,
      dispatch,
      initialArg,
      init,
    });

    return [state, dispatch];
  }

  update_useReducer(hookIndex, { action }, logs) {
    const hook = this.hooks[hookIndex];

    const oldState = hook.state;
    let nextState = hook.state.setValue(
      hook.reducer(oldState.getValue(), action)
    );

    logs.push({ type: 'update/useReducer', reducer: hook.reducer, action, oldState, nextState });

    this.hooks[hookIndex] = {
      ...hook,
      state: nextState,
    };
  }

  add_useCallback(callback) {
    this.hookPointer++;

    // optional arguments
    const deps = arguments.length > 2 ? arguments[1] : undefined;
    // logs is always the last argument, because other args can be optional
    const logs = arguments[arguments.length - 1];

    if (this.hooks[this.hookPointer] !== undefined) {
      const hook = this.hooks[this.hookPointer];
      const { callback: prevCallback, deps: prevDeps } = hook;

      let shouldUpdate = false;
      for(let i=0; i<deps.length; i++) {
        if (prevDeps[i] !== deps[i]) {
          shouldUpdate = true;
          break;
        }
      }

      const newCallback = shouldUpdate ? callback : prevCallback;

      logs.push({ type: 'update/useCallback', shouldUpdate, callback: newCallback, prevCallback, deps, prevDeps });

      this.hooks[this.hookPointer] = {
        ...hook,
        callback: newCallback,
        deps,
      };

      return newCallback;
    }

    this.hooks.push({
      type: 'useCallback',
      callback,
      deps,
    });

    logs.push({ type: 'hooks/useCallback', callback, deps });

    return callback;
  }

  add_useMemo(memo) {
    this.hookPointer++;

    // optional arguments
    const deps = arguments.length > 2 ? arguments[1] : undefined;
    // logs is always the last argument, because other args can be optional
    const logs = arguments[arguments.length - 1];

    if (this.hooks[this.hookPointer] !== undefined) {
      const hook = this.hooks[this.hookPointer];
      const { memoised: prevMemoised, deps: prevDeps } = hook;

      let shouldUpdate = false;
      for(let i=0; i<deps.length; i++) {
        if (prevDeps[i] !== deps[i]) {
          shouldUpdate = true;
          break;
        }
      }

      const newMemoised = shouldUpdate ? new ProxyObject(memo()) : prevMemoised;

      logs.push({ type: 'update/useMemo', shouldUpdate, memoised: newMemoised, prevMemoised, deps, prevDeps, memo });

      this.hooks[this.hookPointer] = {
        ...hook,
        memoised: newMemoised,
        deps,
      };

      return newMemoised;
    }

    const memoised = new ProxyObject(memo());

    this.hooks.push({
      type: 'useMemo',
      memoised,
      deps,
    });

    logs.push({ type: 'hooks/useMemo', memoised, memo, deps });

    return memoised;
  }

  clone() {
    const hook = new Hook();
    hook.hooks = [...this.hooks];
    hook.hookPointer = this.hookPointer;
    hook.dispatch = this.dispatch;
    return hook;
  }
}
