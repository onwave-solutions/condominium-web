import { Field } from "@rijudev/parseus";
import { BooleanTransformer } from "../utils/boolean";

export class Condominium {
  @Field()
  id?: number;
  @Field()
  name?: string;
  @Field()
  address?: string;
  @Field()
  latitude?: number;
  @Field()
  longitude?: number;
  @Field()
  createdAt?: string;
  @Field()
  updatedAt?: string;
  @Field()
  currencySymbol?: string;

  isValid?: boolean;

  @Field({ transformer: new BooleanTransformer() })
  public deprecated?: boolean;
}

export class CondominiumManager {
  @Field()
  condominiumId?: number;

  @Field()
  managerId?: number;
}
