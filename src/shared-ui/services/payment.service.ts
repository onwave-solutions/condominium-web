import Parseus from "@rijudev/parseus";
import { AbstractService } from "./abstract-service";
import { Payment } from "../models/payment.model";

export class PaymentService extends AbstractService<Payment> {
  constructor() {
    super(Payment, "payment");
  }

  async pdfById(id: number) {
    const { data } = await this.service.get<any>(`${this.prefix}/pdf/${id}`);
    return data;
  }

  async financialReport(query: any) {
    const { data } = await this.service.post<any>(
      `${this.prefix}/financial-report`,
      query
    );
    return data;
  }

  async accept(payment: Payment) {
    await this.service.post(
      `${this.prefix}/accept`,
      Parseus.encode(payment, Payment)
    );
  }

  async reject(id: number) {
    await this.service.delete(`${this.prefix}/reject/${id}`);
  }
}
