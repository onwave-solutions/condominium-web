import { AbstractService } from "./abstract-service";
import { Supplier } from "../models/supplier.model";

export class SupplierService extends AbstractService<Supplier> {
  constructor() {
    super(Supplier, "supplier");
  }
}
