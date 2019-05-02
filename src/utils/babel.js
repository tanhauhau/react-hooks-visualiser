// @flow
import * as babel from '@babel/core';
import reactPreset from '@babel/preset-react';
import generate from '@babel/generator';

const babelOptions = {
  ast: true,
  presets: [reactPreset],
  plugins: [
    () => ({
      manipulateOptions(opts, parserOpts) {
        // enable jsx
        parserOpts.plugins.push('objectRestSpread');
      },
    }),
  ],
};

export function parse(code: string) {
  return babel
    .transformAsync(code, babelOptions)
    .then(({ ast }) => ast)
}

export { generate };
