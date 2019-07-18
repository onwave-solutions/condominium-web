import Parseus from "@rijudev/parseus";
import { AbstractService } from "./abstract-service";
import { Invoice, BulkInvoice } from "../models/invoice.model";
import { AdvanceQuery } from "../models/keylist";

export class InvoiceService extends AbstractService<Invoice> {
  constructor() {
    super(Invoice, "invoice");
  }

  async getByCondominiumId(
    condominiumId: number,
    where: AdvanceQuery<Invoice> = {}
  ): Promise<Invoice[]> {
    const { data } = await this.service.post<Invoice[]>(
      `${this.prefix}/condominium/${condominiumId}`,
      where
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
