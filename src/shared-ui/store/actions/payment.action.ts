import { Payment } from "../../models/payment.model";
import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";
import { createAction } from "../../utils/redux";
import { Invoice } from "../../models/invoice.model";
import { InvoiceService } from "../../services/invoice.service";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";
import { PaymentService } from "../../services/payment.service";
export enum PaymentActions {
  SetPayment = "payment/SET_PAYMENT",
  SetInvoice = "payment/SET_INVOICE"
}

const invoiceService = new InvoiceService();
const service = new PaymentService();

export function setPaymentAction(payload: Partial<Payment>) {
  return createAction(PaymentActions.SetPayment, payload);
}

export function setPaymentInvoiceAction(payload: Invoice) {
  return createAction(PaymentActions.SetInvoice, payload);
}

export function proceedPaymentAction(payment: Partial<Payment>, cb: () => void) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      await service.create(payment);
      toast.success("Pago Realizado Correctamente.");
      cb()
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}

export function getPaymentInvoiceAction(id: number) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const invoice = await invoiceService.findOne(id);
      dispatch(setPaymentInvoiceAction(invoice));
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}
