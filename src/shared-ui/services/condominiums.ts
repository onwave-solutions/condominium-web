import axiosInstance from "./axios";
import Parseus from "@rijudev/parseus";
import { Condominium } from "../models/condominium";

export async function createCondominium(
  condominium: Condominium
): Promise<Condominium> {
  const { data } = await axiosInstance.post<Condominium>(
    "condominium",
    Parseus.encode(condominium, Condominium)
  );
  return Parseus.decode(data).to(Condominium);
}

export async function getCondominium(
  where: Partial<Condominium> = {}
): Promise<Condominium[]> {
  const { data } = await axiosInstance.post<Condominium[]>(
    "condominium/find",
    where
  );
  return data.map(item => Parseus.decode(item).to(Condominium));
}

export async function updateCondominium(
  id: number,
  patch: Partial<Condominium>
): Promise<Condominium> {
  const { data } = await axiosInstance.put<Condominium>(
    `condominium/${id}`,
    Parseus.encode(patch, Condominium)
  );

  return Parseus.decode(data).to(Condominium);
}
