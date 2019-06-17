import { useEffect, useRef, useState } from "react";
import debounce from "lodash/fp/debounce";

import { RootState } from "../reducers";
import { useReduxStore } from "../context";

export type ExtractSelector<S> = S extends (state: any) => infer R
  ? (state: RootState) => R
  : (state: RootState) => any;

type Result<S> = S extends (...args: any[]) => infer R ? R : any;

export default function useReduxState<S extends (state: any) => any>(
  selector: S,
  callback?: (value: Result<S>) => void
) {
  const store = useReduxStore();
  const debouncer = debounce(1);

  const [result, setResult] = useState<Result<S>>(() =>
    selector(store.getState())
  );

  const cacheRef = useRef(result);

  useEffect(() => {
    if (callback) callback(result);
  }, []);

  useEffect(() => {
    return store.subscribe(() => {
      if (!selector) {
        resolve(undefined as any);
        return;
      }

      const newResult = selector(store.getState());
      resolve(newResult);
    });
  }, [store]);

  const resolve = debouncer((value: Result<S>) => {
    if (cacheRef.current === value) return;

    cacheRef.current = value;

    if (callback) {
      callback(value);
      return;
    }

    setResult(value);
  });

  return result;
}
