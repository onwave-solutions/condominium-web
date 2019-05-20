import { RootState } from "../reducers";

export function managerSelector(state: RootState) {
  return state.manager;
}
