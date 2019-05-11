import { Field } from "@rijudev/parseus";

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
}
