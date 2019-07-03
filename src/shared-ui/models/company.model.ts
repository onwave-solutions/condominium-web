import { Field } from "@rijudev/parseus";
import { KeylistType } from "./keylist";

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

  @Field()
  public cellphone?: string;

  @Field()
  public address?: string;

  @Field({ factory: KeylistType, type: "object" })
  public documentRaw?: KeylistType;
}
