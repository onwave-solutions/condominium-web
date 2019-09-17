import { Payment } from "../../models/payment.model";
import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";
import { createAction } from "../../utils/redux";
import { Invoice } from "../../models/invoice.model";
import { InvoiceService } from "../../services/invoice.service";
import { getErrorResponse, KeyOf } from "../../utils/objects";
import { loadingWrapper } from "./app";
import { PaymentService } from "../../services/payment.service";
import { AdvanceQuery } from "../../models/keylist";

export enum PaymentActions {
  SetPayment = "payment/SET_PAYMENT",
  SetPayments = "payment/SET_PAYMENTS",
  SetInvoice = "payment/SET_INVOICE"
}

const invoiceService = new InvoiceService();
const service = new PaymentService();

export function setPaymentAction(payload: Partial<Payment>) {
  return createAction(PaymentActions.SetPayment, payload);
}

export function setPaymentsAction(payload: Payment[]) {
  return createAction(PaymentActions.SetPayments, payload);
}

export function setPaymentInvoiceAction(payload: Invoice) {
  return createAction(PaymentActions.SetInvoice, payload);
}

export function acceptPaymentAction(query: AdvanceQuery<Payment>) {
  return (payment: Payment) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await service.accept(payment);
        dispatch(loadPaymentsByQueryAction(query));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function rejectPaymentAction(query: AdvanceQuery<Payment>) {
  return (id: number) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await service.reject(id);
        dispatch(loadPaymentsByQueryAction(query));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function loadPaymentsByQueryAction(
  payment: AdvanceQuery<Payment> | AdvanceQuery<Payment>[],
  sortBy?: { [P in KeyOf<Payment>]?: "ASC" | "DESC" | 1 | -1 }
) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await service.query(payment, sortBy);
      console.log(data)
      dispatch(setPaymentsAction(data));
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}

export function updateExpenseAction(
  payment: Partial<Payment>,
  cb?: () => void
) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      await service.update(payment.id!, payment);
      toast.success("Pago Anulado Correctamente.");
      cb && cb();
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}

export function proceedPaymentAction(
  payment: Partial<Payment>,
  cb: () => void
) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      await service.create(payment);
      toast.success("Pago Realizado Correctamente.");
      cb();
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
