import { AbstractService } from "./abstract-service";
import { NewsFee } from "../models/news-fee.model";

export class NewsFeeService extends AbstractService<NewsFee> {
  constructor() {
    super(NewsFee, "newsFee");
  }
}
