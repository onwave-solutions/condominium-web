import { RootState } from "../reducers";

export function adminSelector(state: RootState) {
  return state.admin;
}
