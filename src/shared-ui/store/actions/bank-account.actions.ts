import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { createAction } from "../../utils/redux";
import { BankAccount } from "../../models/bank-account";
import { BankAccountService } from "../../services/bank-account.service";

export enum BankAccountActions {
  SetBankAccount = "BANK_ACCOUNT_SET_BANK_ACCOUNT",
  SetBankAccounts = "BANK_ACCOUNT_SET_BANK_ACCOUNTS"
}

const service = new BankAccountService();

export function setBankAccountAction(payload: Partial<BankAccount>) {
  return createAction(BankAccountActions.SetBankAccount, payload);
}

export function setBankAccountsAction(payload: BankAccount[]) {
  return createAction(BankAccountActions.SetBankAccounts, payload);
}

export function updateBankAccountAction(id?: string) {
  return (bankAccount: Partial<BankAccount>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.update(bankAccount.id!, bankAccount);
      dispatch(setBankAccountAction(data));
      toast.success("Cuenta Bancaria Actualizada Correctamente");
      dispatch(
        refreshBankAccountsAction(id)({
          condominiumId: bankAccount.condominiumId
        })
      );
    } catch (e) {}
  };
}

export function createBankAccountAction(id?: string) {
  return (bankAccount: Partial<BankAccount>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.create(bankAccount);
      dispatch(setBankAccountAction(data));
      toast.success("Cuenta Bancaria Creada Correctamente");
      dispatch(
        refreshBankAccountsAction(id)({
          condominiumId: bankAccount.condominiumId
        })
      );
    } catch (e) {}
  };
}

export function refreshBankAccountsAction(id?: string) {
  return (payload: Partial<BankAccount>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.query({
        condominiumId: payload.condominiumId
      });
      dispatch(setBankAccountsAction(data));
    } catch (e) {}
  };
}