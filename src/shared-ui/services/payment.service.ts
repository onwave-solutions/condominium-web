import Parseus from "@rijudev/parseus";
import { AbstractService } from "./abstract-service";
import { Payment } from "../models/payment.model";

export class PaymentService extends AbstractService<Payment> {
  constructor() {
    super(Payment, "payment");
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
