import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";
import { Condominium } from "../../models/condominium";
import { createAction } from "../../utils/redux";
import {
  getCondominium,
  createCondominium,
  updateCondominium
} from "../../services/condominiums";
import { setBuildingAction } from "./building";

export enum CondominiumActions {
  SetCondominium = "SET_CONDOMINIUM",
  SetCondominiums = "SET_CONDOMINIUMS"
}

export function setCondominiumAction(payload: Partial<Condominium>) {
  return createAction(CondominiumActions.SetCondominium, payload);
}

export function setCondominiumsAction(payload: Condominium[]) {
  return createAction(CondominiumActions.SetCondominiums, payload);
}

export function updateCondominiumAction(id?: string) {
  return (condominium: Partial<Condominium>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await updateCondominium(condominium.id!, condominium);
      dispatch(setCondominiumAction(data));
      toast.success("Condominio Actualizado Correctamente");
      dispatch(refreshCondominiumsAction(id)());
    } catch (e) {}
  };
}

export function createCondominiumAction(id?: string) {
  return (condominium: Partial<Condominium>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await createCondominium(condominium);
      dispatch(setCondominiumAction(data));
      toast.success("Condominio Creado Correctamente");
      dispatch(refreshCondominiumsAction(id)());
    } catch (e) {}
  };
}

export function refreshCondominiumsAction(id?: string) {
  return () => async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await getCondominium();
      dispatch(setCondominiumsAction(data));
    } catch (e) {}
  };
}
