import { RootState } from "../reducers";

export function apartmentSelector(state: RootState) {
  return state.apartment;
}
