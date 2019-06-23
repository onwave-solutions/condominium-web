import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { createAction } from "../../utils/redux";
import { User } from "../../models/user";
import { UserService } from "../../services/users";
import { Condominium, CondominiumManager } from "../../models/condominium";
import { CondominumService } from "../../services/condominium.service";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";

export enum ManagerActions {
  SetManager = "MANAGER_SET_MANAGER",
  SetManagers = "MANAGER_SET_MANAGERS",
  SetCondominiums = "MANAGER_SET_CONDOMINIUMS",
  SetCondominium = "MANAGER_SET_CONDOMINIUM"
}

const service = new UserService();
const condominiumService = new CondominumService();

export function setDefaultCondominiumAction(id?: string) {
  return (payload: CondominiumManager) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await service.setDefaultCondominiumToManager(payload);
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function getCondominiumsByManagerIdAction(id?: string) {
  return (managerId: number) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const condominiums = await condominiumService.findCondominiumsByManagerId(
          managerId
        );
        dispatch(setCondominiumsToManagerAction(condominiums));
        const condominium = await condominiumService.getDefaultCondominiumByManagerId(
          managerId
        );
        dispatch(setCondominiumToManagerAction({ ...condominium }));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function setCondominiumToManagerAction(payload: Condominium) {
  return createAction(ManagerActions.SetCondominium, payload);
}

export function setCondominiumsToManagerAction(payload: Condominium[]) {
  return createAction(ManagerActions.SetCondominiums, payload);
}

export function setManagerAction(payload: Partial<User>) {
  return createAction(ManagerActions.SetManager, payload);
}

export function setManagersAction(payload: User[]) {
  return createAction(ManagerActions.SetManagers, payload);
}

export function loadManagerAction(id?: string) {
  return () =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.query({ roleId: "MA" });
        dispatch(setManagersAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function setManagerByIdAction(id: number) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await service.findOne(id);
      dispatch(setManagerAction(data));
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}

export function updateManagerAction(id?: string) {
  return (user: Partial<User>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.update(user.id!, user);
        dispatch(setManagerAction(data));
        dispatch(loadManagerAction(id)());
        dispatch(setManagerByIdAction(user.id!));
        toast.success("Manager Actualizado Correctamente.");
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function signUpManagerAction(id?: string) {
  return (user: Partial<User>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.signUp({ ...user, roleId: "MA" });
        dispatch(setManagerAction({}));
        dispatch(loadManagerAction(id)());
        toast.success("Manager Creado Correctamente.");
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
