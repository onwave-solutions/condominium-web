import { RootState } from "../reducers";

export function paymentSelector(state: RootState) {
  return state.payment;
}
