import { RootState } from "../reducers";

export function ticketSelector(state: RootState) {
  return state.ticket;
}
