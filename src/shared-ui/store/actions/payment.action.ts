import { Payment } from "../../models/payment.model";
import { ThunkDispatch } from "redux-thunk";
import { createAction } from "../../utils/redux";
import { Invoice } from "../../models/invoice.model";
import { InvoiceService } from "../../services/invoice.service";
export enum PaymentActions {
  SetPayment = "PAYMENT_SET_PAYMENT",
  SetInvoices = "PAYMENT_SET_INVOICES"
}

const service = new InvoiceService();

export function setPaymentAction(payload: Partial<Payment>) {
  return createAction(PaymentActions.SetPayment, payload);
}

export function setPaymentInvoicesAction(payload: Invoice[]) {
  return createAction(PaymentActions.SetInvoices, payload);
}

export function getPaymentInvoicesListAction(props?: string) {
  return (condominiumId: number) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const invoices = await service.getByCondominiumId(condominiumId);
    } catch (e) {
      console.log(e);
    }
  };
}
