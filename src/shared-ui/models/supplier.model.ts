import { Field } from "@rijudev/parseus";

export class Supplier {
  @Field()
  id?: number;

  @Field()
  public condominiumId?: number;

  @Field()
  public description?: string;

  @Field()
  public documentId?: string;

  @Field()
  public document?: string;

  @Field()
  public disabled?: boolean;

  @Field()
  createdAt?: string;

  @Field()
  updatedAt?: string;
}
