import { AbstractService } from "./abstract-service";
import { Ticket } from "../models/ticket.model";

export class TicketService extends AbstractService<Ticket> {
  constructor() {
    super(Ticket, "ticket");
  }

  async addComment(ticketId: number, comment: string) {
    await this.service.post<void>(`${this.prefix}/${ticketId}/comment`, {
      comment
    });
  }
}
