import Parseus from "@rijudev/parseus";
import { AbstractService } from "./abstract-service";
import { Invoice, BulkInvoice } from "../models/invoice.model";

export class InvoiceService extends AbstractService<Invoice> {
  constructor() {
    super(Invoice, "invoice");
  }

  async getByCondominiumId(condominiumId: number): Promise<Invoice[]> {
    const { data } = await this.service.get<Invoice[]>(
      `${this.prefix}/condominium/${condominiumId}`
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
