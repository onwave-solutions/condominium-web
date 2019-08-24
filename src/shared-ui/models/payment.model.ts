import { Field } from "@rijudev/parseus";
import { KeylistType } from "./keylist";
import { Transaction } from "./transaction.model";
import { BankAccount } from "./bank-account";
import { Invoice } from "./invoice.model";
import { User } from "./user";
import { DateTimeTransformer } from "../utils/dates";
import { BooleanTransformer } from "../utils/boolean";

export class Attachment {
  @Field()
  public id?: number;

  @Field()
  public url?: string;

  @Field()
  public description?: string;
}

export class Payment {
  @Field()
  public id?: number;

  @Field({ transformer: new BooleanTransformer() })
  public isManager?: boolean;

  @Field({ transformer: new DateTimeTransformer() })
  public createdAt?: string;

  @Field({ transformer: new DateTimeTransformer() })
  public updatedAt?: string;

  @Field()
  public createdBy?: number;

  @Field()
  public updatedBy?: number;

  @Field()
  public invoiceId?: number;

  @Field({ transformer: new DateTimeTransformer() })
  public approvedAt?: string;

  @Field()
  public methodTypeId?: string;

  @Field()
  public reference?: string

  @Field()
  public description?: string

  @Field({ type: "decimal", fixed: 2 })
  public amount?: number;

  @Field()
  public statusTypeId?: string;

  @Field({ factory: KeylistType, type: "object" })
  public status?: KeylistType;

  @Field({ factory: KeylistType, type: "object" })
  public methodType?: KeylistType;

  @Field()
  public condominiumId?: number;

  @Field()
  public bankAccountId?: number;

  @Field({ factory: BankAccount, type: "object" })
  public bankAccount?: BankAccount;

  @Field({ factory: Invoice, type: "object" })
  public invoice?: Invoice;

  @Field({ type: "object", factory: User })
  public userCreatedBy?: User;

  @Field({ type: "object", factory: User })
  public approved?: User;

  @Field({ type: "object", factory: User })
  public userUpdatedBy?: User;

  @Field({ type: "array", factory: Attachment })
  public attachments?: Attachment[];
}
