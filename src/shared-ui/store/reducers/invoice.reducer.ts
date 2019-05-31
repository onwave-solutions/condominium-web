import { produce } from "immer";
import moment from "moment";

import { Action } from "../../models/redux";
import { Invoice, InvoiceDetail } from "../../models/invoice.model";
import { InvoiceActions } from "../actions/invoice.actions";

export type IInvoiceState = {
  invoice: Partial<Invoice>;
  invoices: Invoice[];
};

const initialState: Readonly<IInvoiceState> = {
  invoices: [],
  invoice: {
    total: 0,
    discount: 0,
    subTotal: 0,
    dueDate: moment()
      .add(1, "days")
      .format("DD/MM/YYYY"),
    invoiceDetails: [{ key: 1 }]
  }
};

function calculateAmmounts(draft: IInvoiceState) {
  draft.invoice.subTotal = draft.invoice.invoiceDetails!.reduce(
    (acc: number, item: InvoiceDetail) => acc + (item.price || 0),
    0
  );
  draft.invoice.total =
    (draft.invoice.subTotal || 0) - (draft.invoice.discount || 0);
}

function reducer(action: Action<InvoiceActions, any>) {
  return (draft: IInvoiceState) => {
    switch (action.type) {
      case InvoiceActions.ResetInvoice:
        draft.invoice = initialState.invoice;
        break;
      case InvoiceActions.UpdateInvoice:
        draft.invoice = action.payload;
        calculateAmmounts(draft);
        break;
      case InvoiceActions.SetInvoice:
        draft.invoice = action.payload;
        break;
      case InvoiceActions.SetInvoiceDetails:
        draft.invoice.invoiceDetails = action.payload;
        calculateAmmounts(draft);
        break;
      case InvoiceActions.SetInvoices:
        draft.invoices = action.payload;
      default:
    }
  };
}

export default function invoiceEditorReducer(
  state: IInvoiceState = initialState,
  action: any
): IInvoiceState {
  return produce(state, reducer(action));
}
