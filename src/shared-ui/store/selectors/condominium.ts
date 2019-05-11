import { RootState } from "../reducers";

export function condominiumSelector(state: RootState) {
  return state.condominium;
}
