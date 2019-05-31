import { RootState } from "../reducers";

export function bankAccountSelector(state: RootState) {
  return state.bankAccount;
}
