import { Field } from "@rijudev/parseus";
import { KeylistType } from "./keylist";
import { BooleanTransformer } from '../utils/boolean';

export class Company {
  @Field()
  public id?: number;

  @Field()
  public createdAt?: string;

  @Field()
  public updatedAt?: string;

  @Field()
  public name?: string;

  @Field({ factory: KeylistType, type: "object" })
  public documentType?: KeylistType;

  @Field()
  public document?: string;

  @Field()
  public phone?: string;

  @Field()
  public cellphone?: string;

  @Field()
  public address?: string;

  @Field({ transformer: new BooleanTransformer() })
  public deprecated?: boolean;
}
