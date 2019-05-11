import { Field } from "@rijudev/parseus";

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
}
