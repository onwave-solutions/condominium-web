import { Field } from "@rijudev/parseus";

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

  @Field({ type: "decimal", fixed: 2 })
  public amount?: number;

  @Field()
  createdAt?: string;
  @Field()
  updatedAt?: string;
}
