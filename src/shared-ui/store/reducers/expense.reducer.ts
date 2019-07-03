import { produce } from "immer";

import { Action } from "../../models/redux";
import { Expense } from "../../models/expense.model";
import { ExpenseActions } from "../actions/expense.actions";

export type IExpenseState = {
  expense: Partial<Expense>;
  expenses: Expense[];
};

const initialState: Readonly<IExpenseState> = {
  expense: {},
  expenses: []
};

function reducer(action: Action<ExpenseActions, any>) {
  return (draft: IExpenseState) => {
    switch (action.type) {
      case ExpenseActions.SetExpense:
        draft.expense = action.payload;
        break;
      case ExpenseActions.SetExpenses:
        draft.expenses = action.payload;
        break;
      default:
    }
  };
}

export default function expenseReducer(
  state: IExpenseState = initialState,
  action: any
): IExpenseState {
  return produce(state, reducer(action));
}
