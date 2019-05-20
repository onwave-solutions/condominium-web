import { RootState } from "../reducers";

export function companySelector(state: RootState) {
  return state.company;
}
