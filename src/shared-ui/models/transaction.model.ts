import { Field } from "@rijudev/parseus";
import { BankAccount } from "./bank-account";
import { DateTimeTransformer } from "../utils/dates";
import { Payment } from "./payment.model";
import { Supplier } from './supplier.model';
import { User } from './user';

export class ExpenseNoTransaction {
  @Field()
  public id?: number;

  @Field()
  public createdAt?: string;

  @Field()
  public updatedAt?: string;

  @Field()
  public createdBy?: number;

  @Field()
  public updatedBy?: number;

  @Field()
  public supplierId?: number;

  @Field()
  public bankAccountId?: number;

  @Field()
  public condominiumId?: number;

  @Field()
  public amount?: number;

  @Field()
  public date?: string;

  @Field()
  public description?: number;


  @Field({ factory: Supplier, type: "object" })
  public supplier?: Supplier;

  @Field({ factory: User, type: "object" })
  userCreatedBy?: User;

  @Field({ factory: BankAccount, type: "object" })
  public bankAccount?: BankAccount;
}

export class Transaction {
  @Field()
  public id?: number;

  @Field({ transformer: new DateTimeTransformer() })
  public createdAt?: string;

  @Field({ transformer: new DateTimeTransformer() })
  public updatedAt?: string;

  @Field()
  public createdBy?: number;

  @Field()
  public updatedBy?: number;

  @Field()
  public transactionId?: string;

  @Field()
  public accountId?: number;

  @Field({ type: "decimal", fixed: 2 })
  public income?: number;

  @Field({ type: "decimal", fixed: 2 })
  public balance?: number;

  @Field({ type: "decimal", fixed: 2 })
  public outcome?: number;

  @Field()
  public paymentId?: number;

  @Field()
  public expenseId?: number;

  @Field({ type: "object", factory: ExpenseNoTransaction })
  public expense?: ExpenseNoTransaction;

  @Field({ type: "object", factory: BankAccount })
  public account?: BankAccount;

  @Field({ type: "object", factory: Payment })
  public payment?: Payment;
}
