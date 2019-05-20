import { Field } from "@rijudev/parseus";

export class Company {
  @Field()
  public id?: number;

  @Field()
  public createdAt?: string;

  @Field()
  public updatedAt?: string;

  @Field()
  public name?: string;

  @Field()
  public documentId?: string;

  @Field()
  public document?: string;

  @Field()
  public phone?: string;
}
