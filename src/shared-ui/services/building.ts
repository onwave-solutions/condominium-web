import axiosInstance from "./axios";
import Parseus from "@rijudev/parseus";
import { Building } from "../models/building";

export async function createBuilding(building: Building): Promise<Building> {
  const { data } = await axiosInstance.post<Building>(
    "building",
    Parseus.encode(building, Building)
  );
  return Parseus.decode(data).to(Building);
}

export async function getBuilding(
  where: Partial<Building> = {}
): Promise<Building[]> {
  const { data } = await axiosInstance.post<Building[]>("building/find", where);
  return data.map(item => Parseus.decode(item).to(Building));
}

export async function updateBuilding(
  id: number,
  patch: Partial<Building>
): Promise<Building> {
  const { data } = await axiosInstance.put<Building>(
    `building/${id}`,
    Parseus.encode(patch, Building)
  );
  return Parseus.decode(data).to(Building);
}
