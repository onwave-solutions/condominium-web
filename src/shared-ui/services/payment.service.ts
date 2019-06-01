import { AbstractService } from "./abstract-service";
import { Payment } from "../models/payment.model";

export class PaymentService extends AbstractService<Payment> {
  constructor() {
    super(Payment, "payment");
  }
}
