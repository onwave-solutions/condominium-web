import { Field } from "@rijudev/parseus";
import { KeylistType } from "./keylist";

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

  @Field({ type: "decimal", fixed: 2 })
  public mt2?: number;

  @Field()
  public dueDay?: number;

  @Field()
  public serviceType?: string;

  @Field({ type: "decimal", fixed: 2 })
  public amount?: number;

  @Field()
  createdAt?: string;
  @Field()
  updatedAt?: string;

  @Field({ type: "object", factory: KeylistType })
  serviceTypeRaw?: KeylistType;
}
