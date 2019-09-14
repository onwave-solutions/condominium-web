import { Field } from "@rijudev/parseus";
import { DateTransformer, DateTimeTransformer } from "../utils/dates";
import { Apartment } from "./apartment";
import { KeylistType } from "./keylist";
import { Payment } from './payment.model';

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


  @Field({type: 'array', factory: Payment})
  public payments?: Payment[]
}

export class BulkInvoice {
  @Field({ type: "object", factory: Invoice })
  invoice?: Invoice;
  @Field({ type: "array", factory: String })
  creatorKeys?: string[];
}
