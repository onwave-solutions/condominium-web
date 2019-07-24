import { RootState } from "../reducers";

export function dashboardSelector(state: RootState) {
  return state.dashboard;
}
