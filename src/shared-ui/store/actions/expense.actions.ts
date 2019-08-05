import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { createAction } from "../../utils/redux";
import { Expense } from "../../models/expense.model";
import { ExpenseService } from "../../services/expense.service";
import { getErrorResponse, KeyOf } from "../../utils/objects";
import { loadingWrapper } from "./app";
import { AdvanceQuery } from "../../models/keylist";

export enum ExpenseActions {
  SetExpense = "EXPENSE_SET_EXPENSE",
  SetExpenses = "EXPENSE_SET_EXPENSES"
}

const service = new ExpenseService();

export function setExpenseAction(payload: Partial<Expense>) {
  return createAction(ExpenseActions.SetExpense, payload);
}

export function setExpensesAction(payload: Expense[]) {
  return createAction(ExpenseActions.SetExpenses, payload);
}

export function createExpenseAction(id?: string) {
  return (expense: Partial<Expense>, cb?: () => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.create(expense);
        dispatch(setExpenseAction({ condominiumId: data.condominiumId }));
        toast.success("Gasto Agregado Correctamente");
        dispatch(
          refreshExpensesAction(id)({
            condominiumId: expense.condominiumId
          })
        );
        cb && cb();
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function refreshExpensesAction(id?: string) {
  return (
    payload: AdvanceQuery<Expense>,
    sortBy?: { [P in KeyOf<Expense>]?: "ASC" | "DESC" | 1 | -1 }
  ) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.query(
          {
            ...payload,
          },
          sortBy
        );
        dispatch(setExpensesAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
