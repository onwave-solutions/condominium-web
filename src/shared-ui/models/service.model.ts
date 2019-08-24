import { Field } from "@rijudev/parseus";
import { KeylistType } from "./keylist";
import { BooleanTransformer } from "../utils/boolean";

export class Service {
  @Field()
  id?: number;

  @Field()
  public condominiumId?: number;

  @Field()
  public name?: string;

  @Field()
  public description?: string;

  @Field()
  public cutoffDay?: number;

  @Field()
  public dueDay?: number;

  @Field()
  public serviceType?: string;

  @Field({ type: "decimal", fixed: 2 })
  public amount?: number;

  @Field({ type: "decimal", fixed: 2 })
  public lateFee?: number;

  @Field({ type: "boolean", default: false })
  public percent?: boolean;

  @Field()
  createdAt?: string;
  @Field()
  updatedAt?: string;

  @Field({ type: "object", factory: KeylistType })
  serviceTypeRaw?: KeylistType;

  @Field({ type: "array", factory: String })
  public apartmentKeys?: string[];

  @Field({ transformer: new BooleanTransformer() })
  public deprecated?: boolean;
}
