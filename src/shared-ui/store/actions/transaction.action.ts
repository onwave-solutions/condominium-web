import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";

import { createAction } from "../../utils/redux";
import { loadingWrapper } from "./app";
import { Transaction } from "../../models/transaction.model";
import { AdvanceQuery } from "../../models/keylist";
import { TransactionService } from "../../services/transaction.service";
import { getErrorResponse } from "../../utils/objects";

const service = new TransactionService();

export enum TransactionActions {
  SetTransactions = "transaction/SET_TRANSACTIONS"
}

export function setTransactionsAction(payload: Transaction[]) {
  return createAction(TransactionActions.SetTransactions, payload);
}

export function loadTransactionsByQueryAction(query: AdvanceQuery<Transaction>) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await service.query(query);
      dispatch(setTransactionsAction(data));
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}