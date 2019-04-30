// @flow
import * as babel from '@babel/core';

const babelOptions = {
  plugins: [
    () => ({
      manipulateOptions(opts, parserOpts) {
        // enable jsx
        parserOpts.plugins.push('jsx', 'objectRestSpread');
      },
    }),
  ],
};

export function parse(code: string) {
  return babel.parseAsync(code, babelOptions);
}
