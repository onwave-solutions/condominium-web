import { Field } from "@rijudev/parseus";
import { BooleanTransformer } from "../utils/boolean";
import { KeylistType } from "./keylist";

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

  @Field({ type: "object", factory: KeylistType })
  documentType?: KeylistType;


  @Field({ transformer: new BooleanTransformer() })
  public disabled?: boolean;

  @Field()
  createdAt?: string;

  @Field()
  updatedAt?: string;
}
