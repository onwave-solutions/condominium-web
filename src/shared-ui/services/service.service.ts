import { AbstractService } from "./abstract-service";
import { Service } from "../models/service.model";

export class ServiceService extends AbstractService<Service> {
  constructor() {
    super(Service, "service");
  }
}
