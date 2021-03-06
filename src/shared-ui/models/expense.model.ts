import { Field } from "@rijudev/parseus";

import { Supplier } from "./supplier.model";
import { Transaction } from "./transaction.model";
import { User } from "./user";
import { BankAccount } from "./bank-account";
import { DateTransformer } from "../utils/dates";
import { Attachment } from "./payment.model";
import { BooleanTransformer } from "../utils/boolean";

export class Expense {
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

  @Field({ transformer: new DateTransformer() })
  public date?: string;

  @Field()
  public description?: number;

  @Field({ factory: Transaction, type: "object" })
  public transaction?: Transaction;

  @Field({ factory: Supplier, type: "object" })
  public supplier?: Supplier;

  @Field({ factory: User, type: "object" })
  userCreatedBy?: User;

  @Field({ factory: BankAccount, type: "object" })
  public bankAccount?: BankAccount;

  @Field({ type: "array", factory: Attachment })
  public attachments?: Attachment[];

  @Field({ transformer: new BooleanTransformer() })
  public undo?: boolean;
}
