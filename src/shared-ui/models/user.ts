import { Field } from "@rijudev/parseus";
import { Apartment } from "./apartment";
import { Company } from "./company.model";
import { KeylistType } from "./keylist";
import { Condominium } from "./condominium";

export class User {
  @Field()
  id?: number;
  @Field()
  roleId?: string;
  @Field()
  username?: string;
  @Field()
  status?: string;
  @Field()
  password?: string;
  @Field()
  name?: string;
  @Field()
  lastName?: string;
  @Field()
  documentId?: string;
  @Field()
  document?: string;
  @Field()
  address?: string;
  @Field()
  phone?: string;
  @Field()
  cellphone?: string;
  @Field()
  lastLogin?: Date;
  @Field()
  createdAt?: Date;
  @Field()
  updatedAt?: Date;

  @Field({ type: "decimal" })
  monthlyFee?: number;

  @Field()
  dueDay?: number;

  @Field()
  companyId?: number;

  @Field()
  token?: string;

  @Field({ type: "array", factory: Apartment })
  apartments?: Apartment[];

  @Field({ type: "object", factory: Company })
  company?: Company;

  @Field({ type: "object", factory: KeylistType })
  documentRaw?: KeylistType;

  @Field({ type: "object", factory: KeylistType })
  statusRaw?: KeylistType;

  @Field({ type: "array", factory: Condominium })
  condominiums?: Condominium[];
}

export interface IAuthorization {
  username?: string;
  password?: string;
  code?: string;
  code2?: string
}
