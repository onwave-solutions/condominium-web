import { AbstractService } from "./abstract-service";
import { User } from "../models/user";
import Parseus from "@rijudev/parseus";
import { Apartment, ApartmentTenant } from "../models/apartment";

export class TenantService extends AbstractService<User> {
  constructor() {
    super(User, "tenant");
  }

  async getApartmentsByTenantId(id: number): Promise<Apartment[]> {
    const { data } = await this.service.get<Apartment[]>(
      `${this.prefix}/${id}/apartments`
    );

    return data.map(item => Parseus.decode(item).to(Apartment));
  }

  async getDefaultApartmentByTenantId(id: number): Promise<Apartment> {
    const { data } = await this.service.get<Apartment>(
      `${this.prefix}/${id}/apartment/default`
    );

    return Parseus.decode(data).to(Apartment);
  }

  async setDefaultApartmentToTenant(payload: ApartmentTenant) {
    await this.service.post<void>(
      `${this.prefix}/apartment/default`,
      Parseus.encode(payload, ApartmentTenant)
    );
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
