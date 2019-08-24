import { Field } from "@rijudev/parseus";
import { Condominium } from "./condominium";
import { Apartment } from "./apartment";
import { BooleanTransformer } from '../utils/boolean';

export class Building {
  @Field()
  id?: number;
  @Field()
  name?: string;
  @Field()
  condominiumId?: number;
  @Field()
  createdAt?: string;
  @Field()
  updatedAt?: string;

  @Field({ factory: Condominium, type: "object" })
  condominium?: Condominium;

  @Field({ isVirtual: true })
  apartments?: Apartment[];

  @Field({ transformer: new BooleanTransformer() })
  public deprecated?: boolean;
}
