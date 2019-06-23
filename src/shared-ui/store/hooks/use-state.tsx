import { useSelector } from "react-redux";

import { RootState } from "../reducers";
import { useReduxStore } from "../context";

export type ExtractSelector<S> = S extends (state: any) => infer R
  ? (state: RootState) => R
  : (state: RootState) => any;

type Result<S> = S extends (...args: any[]) => infer R ? R : any;

export default useSelector;
