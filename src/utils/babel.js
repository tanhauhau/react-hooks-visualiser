// @flow
import * as babel from '@babel/core';
import generate from '@babel/generator';

const babelOptions = {
  plugins: [
    () => ({
      manipulateOptions(opts, parserOpts) {
        // enable jsx
        parserOpts.plugins.push('jsx', 'objectRestSpread');
      }
    })
  ]
};

export function parse(code: string) {
  return babel.parseAsync(code, babelOptions);
}

export { generate };
