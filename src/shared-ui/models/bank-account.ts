import { Field } from "@rijudev/parseus";
import { Condominium } from "./condominium";
import { KeylistType } from "./keylist";
import { BooleanTransformer } from '../utils/boolean';

export class BankAccountTransfer {
  @Field()
  from?: number;

  @Field()
  to?: number;

  @Field({ type: "decimal" })
  public balance?: number;
}

export class BankAccount {
  @Field()
  id?: number;

  @Field()
  public account?: string;

  @Field()
  public condominiumId?: number;

  @Field()
  public bankId?: string;

  @Field()
  public description?: string;

  @Field()
  public balance?: number;

  @Field({ transformer: new BooleanTransformer() })
  public disabled?: boolean;

  @Field()
  createdAt?: string;
  @Field()
  updatedAt?: string;

  @Field({ type: "object", factory: KeylistType })
  public bank?: KeylistType;

  @Field({ type: "object", factory: Condominium })
  public condominium?: Condominium;
}
