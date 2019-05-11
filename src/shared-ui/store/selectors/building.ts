import { RootState } from "../reducers";

export function buildingSelector(state: RootState) {
  return state.building;
}
