import axiosInstance from "./axios";
import { Condominium } from "../models/condominium";

export async function createCondominium(
  condominium: Condominium
): Promise<Condominium> {
  const { data } = await axiosInstance.post<Condominium>(
    "condominiums",
    condominium
  );
  return data;
}

export async function getCondominium(): Promise<Condominium[]> {
  const { data } = await axiosInstance.get<Condominium[]>("condominiums");
  return data;
}
