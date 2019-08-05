import Parseus from "@rijudev/parseus";
import { AbstractService } from "./abstract-service";
import { Invoice, BulkInvoice } from "../models/invoice.model";
import { AdvanceQuery } from "../models/keylist";

export class InvoiceService extends AbstractService<Invoice> {
  constructor() {
    super(Invoice, "invoice");
  }

  async pdfById(id: number) {
    const { data } = await this.service.get<any>(`${this.prefix}/pdf/${id}`);
    return data;
  }

  async getByCondominiumId(
    condominiumId: number,
    where: AdvanceQuery<Invoice> = {},
    sortBy?: any
  ): Promise<Invoice[]> {
    const { data } = await this.service.post<Invoice[]>(
      `${this.prefix}/condominium/${condominiumId}`,
      { query: where, sortBy }
    );

    return data.map(item => Parseus.decode(item).to(Invoice));
  }

  async reportByCondominiumId(
    condominiumId: number,
    where: AdvanceQuery<Invoice> = {},
    sortBy?: any
  ): Promise<any> {
    const { data } = await this.service.post<any>(
      `${this.prefix}/condominium/${condominiumId}/report`,
      { query: where, sortBy }
    );

    return data;
  }

  async bulkCreate(payload: BulkInvoice): Promise<void> {
    await this.service.post(
      `${this.prefix}/bulkcreate`,
      Parseus.encode(payload, BulkInvoice)
    );
  }
}
