import { createAction } from "../../utils/redux";
import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";
import {
  Invoice,
  InvoiceDetail,
  BulkInvoice
} from "../../models/invoice.model";
import { InvoiceService } from "../../services/invoice.service";
import { closeBlade, addBlade, loadingWrapper } from "./app";
import { getErrorResponse } from "../../utils/objects";

export enum InvoiceActions {
  ResetInvoice = "INVOICE_RESET_INVOICE",
  SetInvoice = "INVOICE_SET_INVOICE",
  UpdateInvoice = "INVOICE_UPDATE_INVOICE",
  SetInvoices = "INVOICE_SET_INVOICES",
  SetInvoiceDetails = "INVOICE_SET_INVOICE_DETAILS"
}

const service = new InvoiceService();

export function bulkCreateAction(id?: string) {
  return (
    payload: BulkInvoice,
    invoiceListId: string,
    condominiumId: number,
    cb: () => void
  ) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await service.bulkCreate(payload);
        dispatch(closeBlade(id!));
        dispatch(addBlade(invoiceListId));
        dispatch(getInvoiceListAction(id)(condominiumId));
        toast.success("Factura Creada Correctamente");
        cb();
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function updateInvoiceServiceAction(id?: string) {
  return (condominiumId: number, payload: Partial<Invoice>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const record = await service.update(payload.id!, payload);
        dispatch(setInvoiceAction(record));
        dispatch(getInvoiceListAction(id)(condominiumId));
        toast.success("Factura Actualizada Correctamente");
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function resetInvoiceAction() {
  return createAction(InvoiceActions.ResetInvoice);
}

export function getInvoiceByIdAction(id?: string) {
  return (id: number) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.findOne(id);
        dispatch(setInvoiceAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function setInvoicesAction(payload: Invoice[]) {
  return createAction(InvoiceActions.SetInvoices, payload);
}

export function getInvoiceListAction(id?: string) {
  return (condominiumId: number) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const invoices = await service.getByCondominiumId(condominiumId);
        dispatch(setInvoicesAction(invoices));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function updateInvoiceAction(payload: Invoice) {
  return createAction(InvoiceActions.UpdateInvoice, payload);
}

export function setInvoiceAction(payload: Invoice) {
  return createAction(InvoiceActions.SetInvoice, payload);
}

export function setInvoiceDetailsAction(payload: InvoiceDetail[]) {
  const newDetails = payload.map((detail: InvoiceDetail, index: number) => {
    detail.key = index + 1;
    detail.price = (detail.cost || 0)! * (detail.unit || 0)!;
    return detail;
  });

  return createAction(InvoiceActions.SetInvoiceDetails, newDetails);
}

export function editInvoiceDetailAction(invoiceDetails: InvoiceDetail[]) {
  return (key: number, name: string, value: any) => (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    const detail = invoiceDetails[key - 1];
    if (!detail) return;
    const newInvoice = {
      ...detail,
      [name]: value
    };
    invoiceDetails[key - 1] = newInvoice;

    return dispatch(setInvoiceDetailsAction([...invoiceDetails]));
  };
}
