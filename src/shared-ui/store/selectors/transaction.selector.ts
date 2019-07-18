import { RootState } from "../reducers";

export function transactionSelector(state: RootState) {
  return state.transaction;
}
