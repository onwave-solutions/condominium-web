import { AbstractService } from "./abstract-service";
import { Transaction } from "../models/transaction.model";
import { BankAccountTransfer } from "../models/bank-account";

export class TransactionService extends AbstractService<Transaction> {
  constructor() {
    super(Transaction, "transaction");
  }

  async transfer(transfer: BankAccountTransfer): Promise<void> {
    await this.service.post(`${this.prefix}/transfer`, transfer);
  }
}
