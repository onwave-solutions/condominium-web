import { produce } from "immer";

import { Action } from "../../models/redux";
import { Payment } from "../../models/payment.model";
import { PaymentActions } from "../actions/payment.action";
import { Invoice } from "../../models/invoice.model";

export type IPaymentState = {
  payment: Partial<Payment>;
  payments: Payment[];
  invoices: Invoice[];
};

const initialState: Readonly<IPaymentState> = {
  payment: {},
  payments: [],
  invoices: []
};

function reducer(action: Action<PaymentActions, any>) {
  return (draft: IPaymentState) => {
    switch (action.type) {
      case PaymentActions.SetPayment:
        draft.payment = action.payload;
        break;
      default:
    }
  };
}

export default function paymentReducer(
  state: IPaymentState = initialState,
  action: any
): IPaymentState {
  return produce(state, reducer(action));
}
