import { Expense } from "../models/expense.model";
import { AbstractService } from "./abstract-service";
export class ExpenseService extends AbstractService<Expense> {
  constructor() {
    super(Expense, "expense");
  }
}
