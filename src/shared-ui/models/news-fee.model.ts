import { Field } from "@rijudev/parseus";
import { Condominium } from "./condominium";
import { User } from "./user";
import { DateTimeTransformer, DateTransformer } from "../utils/dates";

export class NewsFee {
  @Field()
  id?: number;

  @Field()
  public condominiumId?: number;

  @Field()
  public title?: string;

  @Field()
  public description?: string;

  @Field({ type: "array", factory: String })
  public apartmentKeys?: string[];

  @Field()
  public apartmentId?: number;

  @Field({ type: "object", factory: User })
  public userCreatedBy?: User;


  @Field({ transformer: new DateTimeTransformer() })
  createdAt?: string;

  @Field({ transformer: new DateTransformer() })
  endDate?: string;

  @Field()
  updatedAt?: string;
}
