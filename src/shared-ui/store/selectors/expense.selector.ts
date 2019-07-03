import { RootState } from "../reducers";

export function expenseSelector(state: RootState) {
  return state.expense;
}
