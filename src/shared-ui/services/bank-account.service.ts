import { BankAccount } from "../models/bank-account";
import { AbstractService } from "./abstract-service";
export class BankAccountService extends AbstractService<BankAccount> {
  constructor() {
    super(BankAccount, "bankaccount");
  }
}
