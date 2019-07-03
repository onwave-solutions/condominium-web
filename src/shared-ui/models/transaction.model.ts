import { Field } from "@rijudev/parseus";

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

  @Field()
  public income?: number;

  @Field()
  public outcome?: number;

  @Field()
  public paymentId?: number;
}
