import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { createAction } from "../../utils/redux";
import { BankAccount } from "../../models/bank-account";
import { BankAccountService } from "../../services/bank-account.service";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";

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

export function deleteBankAccountAction(payload: Partial<BankAccount>) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      await service.delete(payload.id!);
      toast.success("Caja Eliminada Correctamente");
      dispatch(
        refreshBankAccountsAction()({
          condominiumId: payload.condominiumId
        })
      );
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}

export function updateBankAccountAction(id?: string) {
  return (bankAccount: Partial<BankAccount>, cb?: any) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.update(bankAccount.id!, bankAccount);
        dispatch(setBankAccountAction(data));
        toast.success("Caja Actualizada Correctamente");
        dispatch(
          refreshBankAccountsAction(id)({
            condominiumId: bankAccount.condominiumId,
            disabled: false
          })
        );
        cb && cb();
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function createBankAccountAction(id?: string) {
  return (bankAccount: Partial<BankAccount>, cb?: any) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.create(bankAccount);
        dispatch(setBankAccountAction({ condominiumId: data.condominiumId }));
        toast.success("Caja Creada Correctamente");
        dispatch(
          refreshBankAccountsAction(id)({
            condominiumId: bankAccount.condominiumId,
            disabled: false
          })
        );
        cb && cb();
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function refreshBankAccountsAction(id?: string) {
  return (payload: Partial<BankAccount>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.query(
          {
            condominiumId: payload.condominiumId,
            disabled: false
          },
          { account: "ASC" }
        );
        dispatch(setBankAccountsAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
