import { Field } from "@rijudev/parseus";

export class Apartment {
  @Field()
  id?: number;
  @Field()
  name?: string;
  @Field()
  buildingId?: number;
  @Field({ type: "number" })
  floor?: number;
  @Field({ type: "decimal", fixed: 2 })
  mt2?: number;
  @Field({ type: "boolean" })
  vacancy?: boolean;
  @Field({ type: "decimal", fixed: 2 })
  maintenanceRate?: number;
  @Field()
  parkingLots?: string[];
  @Field()
  createdAt?: string;
  @Field()
  updatedAt?: string;
}
