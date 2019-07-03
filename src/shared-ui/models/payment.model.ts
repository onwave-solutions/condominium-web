import { Field } from "@rijudev/parseus";
import { KeylistType } from "./keylist";
import { Transaction } from './transaction.model';

export class Payment {
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
  public invoiceId?: number;

  @Field()
  public methodTypeId?: string;

  @Field({ type: "decimal", fixed: 2 })
  public amount?: number;

  @Field()
  public statusTypeId?: string;

  @Field({ factory: KeylistType, type: "object" })
  public status?: KeylistType;

  @Field({ factory: Transaction, type: "object" })
  public transaction?: Transaction
}
