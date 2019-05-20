import Parseus from "@rijudev/parseus";
import { AbstractService } from "./abstract-service";
import { Condominium, CondominiumManager } from "../models/condominium";

export class CondominumService extends AbstractService<Condominium> {
  constructor() {
    super(Condominium, "condominium");
  }

  async findCondominiumsByManagerId(id: number) {
    const { data } = await this.service.get<Condominium[]>(
      `${this.prefix}/manager/${id}`
    );

    return data.map(item => Parseus.decode(item).to(Condominium));
  }

  async dropManager(payload: CondominiumManager) {
    await this.service.delete(
      `${this.prefix}/manager`,
      Parseus.encode(payload, CondominiumManager)
    );
  }

  async addManager(payload: CondominiumManager) {
    await this.service.post(
      `${this.prefix}/manager`,
      Parseus.encode(payload, CondominiumManager)
    );
  }
}
