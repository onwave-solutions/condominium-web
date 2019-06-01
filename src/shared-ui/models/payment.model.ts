import { Field } from "@rijudev/parseus";

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
  public description?: string;

  @Field()
  public paymentMethodType?: string;

  @Field({ type: "decimal", fixed: 2 })
  public amount?: number;

  @Field({ isVirtual: true })
  public buildingId?: number;

  @Field({ isVirtual: true })
  public apartmentId?: number;
}
