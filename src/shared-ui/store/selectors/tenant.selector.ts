import { RootState } from "../reducers";

export function tenantSelector(state: RootState) {
  return state.tenant;
}
