// @flow

import { useState, useEffect, useCallback } from 'react';
import * as babel from './babel';

export default function useBabel(
  initialCode: string
): [string, any, ?Error, (string) => void] {
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState(null);
  const [ast, setAst] = useState();
  const onCodeChange = useCallback((code: string) => setCode(code), [setCode]);
  const debouncedCode = useDebounce(code, 500);

  useEffect(() => {
    let cancel = false;
    babel
      .parse(debouncedCode)
      .then(ast => {
        if (!cancel) {
          setAst(ast);
          setError(null);
        }
      })
      .catch(error => {
        if (!cancel) {
          setError(error);
        }
      });
    return () => {
      cancel = true;
    };
  }, [debouncedCode, setAst, setError]);

  return [code, ast, error, onCodeChange];
}

function useDebounce(value, delay) {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, setDebounceValue, delay]);
  return debounceValue;
}
