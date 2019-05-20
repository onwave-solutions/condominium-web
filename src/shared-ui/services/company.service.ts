import { AbstractService } from "./abstract-service";
import { Company } from "../models/company.model";

export class CompanyService extends AbstractService<Company> {
  constructor() {
    super(Company, "company");
  }
}
