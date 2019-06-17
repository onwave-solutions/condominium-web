import { AbstractService } from "./abstract-service";
import { User } from "../models/user";
import Parseus from "@rijudev/parseus";

export class TenantService extends AbstractService<User> {
  constructor() {
    super(User, "tenant");
  }

  async getTenantsByCondominiumId(id: number): Promise<User[]> {
    const { data } = await this.service.get<User[]>(
      `${this.prefix}/condominium/${id}`
    );

    return data.map(item => Parseus.decode(item).to(User));
  }

  async addTenantToCondomium(
    tenantId: number,
    condominiumId: number
  ): Promise<void> {
    await this.service.post<void>(`${this.prefix}/condominium`, {
      tenantId,
      condominiumId
    });
  }
}
