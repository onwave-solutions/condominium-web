import Parseus from "@rijudev/parseus";
import { AbstractService } from "./abstract-service";
import { Payment } from "../models/payment.model";
import { Transaction } from "../models/transaction.model";

export class PaymentService extends AbstractService<Payment> {
  constructor() {
    super(Payment, "payment");
  }

  async accept(transaction: Transaction) {
    await this.service.post(
      `${this.prefix}/accept`,
      Parseus.encode(transaction, Transaction)
    );
  }

  async reject(id: number) {
    await this.service.delete(`${this.prefix}/reject/${id}`);
  }
}
