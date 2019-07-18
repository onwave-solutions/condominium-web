import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";
import { Condominium, CondominiumManager } from "../../models/condominium";
import { createAction } from "../../utils/redux";
import { CondominiumService } from "../../services/condominium.service";
import { setBuildingAction } from "./building";
import { User } from "../../models/user";
import { UserService } from "../../services/users";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";

export enum CondominiumActions {
  SetCondominium = "CONDOMINIUM_SET_CONDOMINIUM",
  SetCondominiums = "CONDOMINIUM_SET_CONDOMINIUMS",
  SetManager = "CONDOMINIUM_SET_MANAGER",
  SetCondominiumManagers = "CONDOMINIUM_SET_CONDOMINIUM_MANAGERS"
}

const service = new CondominiumService();
const userService = new UserService();

export function addCondominiumManagerAction(id?: string) {
  return (condominiumMananger: CondominiumManager, cb?: () => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await service.addManager(condominiumMananger);
        dispatch(setCondominiumManagerAction({}));
        dispatch(
          getCondominiumManagerAction(id)(condominiumMananger.condominiumId!)
        );
        cb && cb();
        toast.success("Condominio Agregado a Manager Correctamente");
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function dropCondominiumManagerAction(id?: string) {
  return (condominiumMananger: CondominiumManager, cb?: () => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await service.dropManager(condominiumMananger);
        dispatch(setCondominiumManagerAction({}));
        dispatch(
          getCondominiumManagerAction(id)(condominiumMananger.condominiumId!)
        );
        cb && cb();
        toast.success("Condominio desasignado");
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function getCondominiumManagerAction(id?: string) {
  return (condominiumId: number) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const condominium = await service.findOne(condominiumId);
        dispatch(setCondominiumAction(condominium));
        const data = await userService.findManagersByCondominiumId(
          condominiumId
        );
        dispatch(setCondominiumManagersActions(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function setCondominiumManagerAction(payload: User) {
  return createAction(CondominiumActions.SetManager, payload);
}

export function setCondominiumManagersActions(payload: User[]) {
  return createAction(CondominiumActions.SetCondominiumManagers, payload);
}

export function setCondominiumAction(payload: Partial<Condominium>) {
  return createAction(CondominiumActions.SetCondominium, payload);
}

export function setCondominiumsAction(payload: Condominium[]) {
  return createAction(CondominiumActions.SetCondominiums, payload);
}

export function updateCondominiumAction(id?: string) {
  return (condominium: Partial<Condominium>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.update(condominium.id!, condominium);
        dispatch(setCondominiumAction(data));
        toast.success("Condominio Actualizado Correctamente");
        dispatch(refreshCondominiumsAction(id)());
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function createCondominiumAction(id?: string) {
  return (condominium: Partial<Condominium>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.create(condominium);
        dispatch(setCondominiumAction({}));
        toast.success("Condominio Creado Correctamente");
        dispatch(refreshCondominiumsAction(id)());
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function refreshCondominiumsAction(id?: string) {
  return () =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.query({});
        dispatch(setCondominiumsAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
