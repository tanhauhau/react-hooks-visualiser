// @flow
export type Effect = {
  callback: () => void;
}

export function executeEffect(effect: Effect) {
  effect.callback();
}