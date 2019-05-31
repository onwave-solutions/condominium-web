import { Field } from "@rijudev/parseus";
import { Building } from "./building";
import { Service } from "./service.model";

export class Apartment {
  @Field()
  id?: number;
  @Field()
  name?: string;
  @Field()
  buildingId?: number;
  @Field()
  serviceId?: number;
  @Field({ type: "number" })
  floor?: number;
  @Field({ type: "decimal", fixed: 2 })
  mt2?: number;
  @Field()
  parkingLots?: string[];
  @Field()
  createdAt?: string;
  @Field()
  updatedAt?: string;

  @Field({ factory: Building, type: "object" })
  building?: Building;

  @Field({ factory: Service, type: "object" })
  service?: Service;
}
