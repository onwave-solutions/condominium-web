import { AbstractService } from "./abstract-service";
import { Transaction } from "../models/transaction.model";

export class TransactionService extends AbstractService<Transaction> {
  constructor() {
    super(Transaction, "transaction");
  }
}
