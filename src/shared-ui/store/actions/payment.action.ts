import { Payment } from "../../models/payment.model";
import { createAction } from "../../utils/redux";
export enum PaymentActions {
  SetPayment = "PAYMENT_SET_PAYMENT"
}

export function setPaymentAction(payload: Partial<Payment>) {
  return createAction(PaymentActions.SetPayment, payload);
}
