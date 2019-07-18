import { produce } from "immer";

import { Action } from "../../models/redux";
import { TransactionActions } from "../actions/transaction.action";
import { Transaction } from "../../models/transaction.model";

export type ITransactionState = {
  transactions: Transaction[];
};

const initialState: Readonly<ITransactionState> = {
  transactions: []
};

function reducer(action: Action<TransactionActions, any>) {
  return (draft: ITransactionState) => {
    switch (action.type) {
      case TransactionActions.SetTransactions:
        draft.transactions = action.payload;
        break;
      default:
    }
  };
}

export default function transactionReducer(
  state: ITransactionState = initialState,
  action: any
): ITransactionState {
  return produce(state, reducer(action));
}
