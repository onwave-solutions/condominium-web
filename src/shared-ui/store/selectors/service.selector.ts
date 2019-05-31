import { RootState } from "../reducers";

export function serviceSelector(state: RootState) {
  return state.service;
}
