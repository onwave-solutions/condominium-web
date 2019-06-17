import { RootState } from "../reducers";

export function supplierSelector(state: RootState) {
  return state.supplier;
}
