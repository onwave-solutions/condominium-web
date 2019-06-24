import { Ticket } from "../../models/ticket.model";
import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";
import { createAction } from "../../utils/redux";
import { TicketService } from "../../services/ticket.service";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";
import { AdvanceQuery } from "../../models/keylist";

export enum TicketActions {
  SetTickets = "TICKET_SET_TICKETS"
}

const service = new TicketService();

export function setTicketsAction(payload: Ticket[]) {
  return createAction(TicketActions.SetTickets, payload);
}

export function createTicketAction(id?: string) {
  return (ticket: Ticket, cb: (ticket: Ticket) => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const newTicket = await service.create(ticket);
        cb(newTicket);
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function addCommentAction(id?: string, ticketId?: number) {
  return (comment: string, cb: (ticket: Ticket) => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await service.addComment(ticketId!, comment);
        const ticket = await service.findOne(ticketId!);
        cb(ticket);
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function updateTicketAction(id?: string) {
  return (ticket: Ticket, cb?: (ticket: Ticket) => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const newTicket = await service.update(ticket.id!, ticket);
        cb && cb(newTicket);
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function loadTicketsByQuery(id?: string) {
  return (query: AdvanceQuery<Ticket> | AdvanceQuery<Ticket>[]) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        if (Array.isArray(query) && (!query.length || !query[0].condominiumId))
          return;
        const data = await service.query(query);
        dispatch(setTicketsAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function loadTicketByCondominiumAction(id?: string) {
  return (condominiumId: number) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.query({ condominiumId });
        dispatch(setTicketsAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
