import { RootState } from "../reducers";

export function newsFeeSelector(state: RootState) {
  return state.newsFee;
}
