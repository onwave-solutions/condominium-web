import { Ticket } from "../../models/ticket.model";
import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";
import { createAction } from "../../utils/redux";
import { TicketService } from "../../services/ticket.service";

export enum TicketActions {
  SetTickets = "TICKET_SET_TICKETS"
}

const service = new TicketService();

export function setTicketsAction(payload: Ticket[]) {
  return createAction(TicketActions.SetTickets, payload);
}

export function createTicketAction(id?: string) {
  return (ticket: Ticket, cb: (ticket: Ticket) => void) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const newTicket = await service.create(ticket);
      cb(newTicket);
    } catch (e) {
      console.log(e);
    }
  };
}

export function addCommentAction(id?: string, ticketId?: number) {
  return (comment: string, cb: (ticket: Ticket) => void) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      await service.addComment(ticketId!, comment);
      const ticket = await service.findOne(ticketId!);
      cb(ticket);
    } catch (e) {
      console.log(e);
    }
  };
}

export function updateTicketAction(id?: string) {
  return (ticket: Ticket, cb?: (ticket: Ticket) => void) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const newTicket = await service.update(ticket.id!, ticket);
      cb && cb(newTicket);
    } catch (e) {
      console.log(e);
    }
  };
}

export function loadTicketsByQuery(id?: string) {
  return (query: Partial<Ticket> | Partial<Ticket>[]) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.query(query);
      dispatch(setTicketsAction(data));
    } catch (e) {
      console.log(e);
    }
  };
}

export function loadTicketByCondominiumAction(id?: string) {
  return (condominiumId: number) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.query({ condominiumId });
      dispatch(setTicketsAction(data));
    } catch (e) {
      console.log(e);
    }
  };
}
