import { produce } from "immer";

import { Action } from "../../models/redux";
import { Ticket } from "../../models/ticket.model";
import { TicketActions } from "../actions/ticket.action";
import { Invoice } from "../../models/invoice.model";

export type ITicketState = {
  tickets: Ticket[];
};

const initialState: Readonly<ITicketState> = {
  tickets: []
};

function reducer(action: Action<TicketActions, any>) {
  return (draft: ITicketState) => {
    switch (action.type) {
      case TicketActions.SetTickets:
        draft.tickets = action.payload;
        break;
      default:
    }
  };
}

export default function ticketReducer(
  state: ITicketState = initialState,
  action: any
): ITicketState {
  return produce(state, reducer(action));
}
