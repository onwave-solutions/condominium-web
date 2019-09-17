import { Field } from "@rijudev/parseus";
import { KeylistType } from "./keylist";
import { Transaction } from "./transaction.model";
import { BankAccount } from "./bank-account";
import { User } from "./user";
import { DateTimeTransformer, DateTransformer } from "../utils/dates";
import { BooleanTransformer } from "../utils/boolean";
import { Apartment } from './apartment';

export class InvoiceDetail {
  @Field()
  public id?: number;

  @Field()
  public key?: number;

  @Field()
  public invoiceId?: number;

  @Field()
  public description?: string;

  @Field({ type: "decimal", fixed: 2 })
  public cost?: number;

  @Field()
  public unit?: number;

  @Field({ type: "decimal", fixed: 2 })
  public price?: number;
}

export class Invoice {
  @Field()
  id?: number;

  @Field()
  sequence?: string;

  @Field()
  public description?: string;

  @Field({ transformer: new DateTransformer() })
  public dueDate?: string;

  @Field()
  public apartmentId?: number;

  @Field()
  public statusType?: string;

  @Field({ type: "decimal", fixed: 2 })
  public discount?: number;

  @Field({ type: "decimal", fixed: 2 })
  public total?: number;


  @Field({ type: "decimal", fixed: 2 })
  public subTotal?: number;

  @Field({ type: "object", factory: Apartment })
  public apartment?: Apartment;

  @Field({ type: "object", factory: KeylistType })
  public status?: KeylistType;

  @Field({ transformer: new DateTimeTransformer() })
  createdAt?: Date;
  @Field()
  updatedAt?: string;

  @Field({ type: "array", factory: InvoiceDetail })
  public invoiceDetails?: InvoiceDetail[];
}

export class BulkInvoice {
  @Field({ type: "object", factory: Invoice })
  invoice?: Invoice;
  @Field({ type: "array", factory: String })
  creatorKeys?: string[];
}

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
