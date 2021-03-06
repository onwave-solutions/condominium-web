import axiosInstance from "./axios";
import Parseus from "@rijudev/parseus";
import { Apartment } from "../models/apartment";
import { AbstractService } from "./abstract-service";
import { Service } from '../models/service.model';

export async function createApartment(
  apartment: Apartment
): Promise<Apartment> {
  const { data } = await axiosInstance.post<Apartment>(
    "apartment",
    Parseus.encode(apartment, Apartment)
  );
  return Parseus.decode(data).to(Apartment);
}

export async function getApartment(
  where: Partial<Apartment> = {}
): Promise<Apartment[]> {
  const { data } = await axiosInstance.post<Apartment[]>(
    "apartment/find",
    where
  );
  return data.map(item => Parseus.decode(item).to(Apartment));
}

export async function updateApartment(
  id: number,
  patch: Partial<Apartment>
): Promise<Apartment> {
  const { data } = await axiosInstance.put<Apartment>(
    `apartment/${id}`,
    Parseus.encode(patch, Apartment)
  );
  return Parseus.decode(data).to(Apartment);
}

export class ApartmentService extends AbstractService<Apartment> {
  constructor() {
    super(Apartment, "apartment");
  }

async bulk(service: Service) {
    await this.service.post<void>(`${this.prefix}/bulkservice`, service);
  }


  async addTenant(tenantId: number, apartmentId: number): Promise<void> {
    await this.service.post<void>(`${this.prefix}/addTenant`, {
      tenantId,
      apartmentId
    });
  }

  async removeTenant(tenantId: number, apartmentId: number): Promise<void> {
    await this.service.post<void>(`${this.prefix}/removeTenant`, {
      tenantId,
      apartmentId
    });
  }

  async getDefaultApartmentByTenantId(id: number) {
    const { data } = await this.service.get<Apartment>(
      `${this.prefix}/tenant/${id}/default`
    );

    return Parseus.decode(data).to(Apartment);
  }
}
