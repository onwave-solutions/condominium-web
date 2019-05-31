import { produce } from "immer";

import { Action } from "../../models/redux";
import { BankAccount } from "../../models/bank-account";
import { BankAccountActions } from "../actions/bank-account.actions";

export type IBankAccountState = {
  bankAccount: Partial<BankAccount>;
  bankAccounts: BankAccount[];
};

const initialState: Readonly<IBankAccountState> = {
  bankAccount: {},
  bankAccounts: []
};

function reducer(action: Action<BankAccountActions, any>) {
  return (draft: IBankAccountState) => {
    switch (action.type) {
      case BankAccountActions.SetBankAccount:
        draft.bankAccount = action.payload;
        break;
      case BankAccountActions.SetBankAccounts:
        draft.bankAccounts = action.payload;
        break;
      default:
    }
  };
}

export default function bankAccountReducer(
  state: IBankAccountState = initialState,
  action: any
): IBankAccountState {
  return produce(state, reducer(action));
}
