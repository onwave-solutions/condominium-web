import Parseus from "@rijudev/parseus";
import { AbstractService } from "./abstract-service";
import { Invoice, BulkInvoice } from "../models/invoice.model";
import { Query } from "../utils/objects";

export class InvoiceService extends AbstractService<Invoice> {
  constructor() {
    super(Invoice, "invoice");
  }

  async getByCondominiumId(
    condominiumId: number,
    where: Invoice = {}
  ): Promise<Invoice[]> {
    const { data } = await this.service.post<Invoice[]>(
      `${this.prefix}/condominium/${condominiumId}`,
      Parseus.encode(where, Invoice)
    );

    return data.map(item => Parseus.decode(item).to(Invoice));
  }

  async bulkCreate(payload: BulkInvoice): Promise<void> {
    await this.service.post(
      `${this.prefix}/bulkcreate`,
      Parseus.encode(payload, BulkInvoice)
    );
  }
}
