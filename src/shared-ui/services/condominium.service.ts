import Parseus from "@rijudev/parseus";
import { AbstractService } from "./abstract-service";
import { Condominium, CondominiumManager } from "../models/condominium";

export class CondominiumService extends AbstractService<Condominium> {
  constructor() {
    super(Condominium, "condominium");
  }

  async getDefaultCondominiumByManagerId(id: number): Promise<Condominium> {
    const { data } = await this.service.get<Condominium>(
      `${this.prefix}/manager/default/${id}`
    );

    return Parseus.decode(data).to(Condominium);
  }

  async findCondominiumsByManagerId(id: number) {
    const { data } = await this.service.get<Condominium[]>(
      `${this.prefix}/manager/${id}`
    );

    return data.map(item => Parseus.decode(item).to(Condominium));
  }

  async dropManager(payload: CondominiumManager) {
    await this.service.post(
      `${this.prefix}/dropmanager`,
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
