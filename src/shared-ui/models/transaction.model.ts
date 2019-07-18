import { Field } from "@rijudev/parseus";
import { BankAccount } from "./bank-account";

export class Transaction {
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

  @Field({ type: "object", factory: BankAccount })
  public account?: BankAccount;
}
