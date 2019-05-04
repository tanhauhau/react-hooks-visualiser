// @flow
import { useReducer, useEffect } from 'react';

type State<T> = {
  history: $ReadOnlyArray<T>,
  index: number
};
type Action<T> =
  | {|
      type: 'push',
      data: T
    |}
  | {| type: 'goto', index: number |}
  | {| type: 'clear' |};

const initialState = {
  history: [],
  index: -1
};

const historyReducer = <T>(
  state: State<T>,
  action: Action<T>
): State<T> => {
  switch (action.type) {
    case 'push':
      return {
        history: [...state.history, action.data],
        index: state.index + 1
      };
    case 'goto':
      return {
        ...state,
        index: action.index
      };
    case 'clear':
      return initialState;
    default:
      return state;
  }
};

export default function useHistory<T>(state: T): T {
  const [history, dispatchHistory] = useReducer(historyReducer, initialState);

  useEffect(() => {
    dispatchHistory({ type: 'push', data: state });
  }, [state, dispatchHistory]);

  const currentState =
    history.index < 0 ? null : history.history[history.index];

  // const gotoHistory = useCallback(
  //   index => dispatchHistory({ type: 'goto', index }),
  //   [dispatchHistory]
  // );
  // const clearHistory = useCallback(() => dispatchHistory({ type: 'clear' }), [
  //   dispatchHistory
  // ]);

  return [currentState, history.history]; // </T></T>, gotoHistory, clearHistory];
}
