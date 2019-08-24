import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { createAction } from "../../utils/redux";
import { User } from "../../models/user";
import { UserService } from "../../services/users";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";

export enum AdminActions {
  SetAdmin = "SET_ADMIN",
  SetAdmins = "SET_ADMINS"
}

const service = new UserService();

export function setAdminAction(payload: Partial<User>) {
  return createAction(AdminActions.SetAdmin, payload);
}

export function setAdminsAction(payload: User[]) {
  return createAction(AdminActions.SetAdmins, payload);
}

export function loadAdminAction(id?: string) {
  return () =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.query({ roleId: "AD" });
        dispatch(setAdminsAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function updateAdminAction(id?: string) {
  return (user: Partial<User>, cb?: any) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.update(user.id!, user);
        dispatch(setAdminAction(data));
        dispatch(loadAdminAction(id)());
        toast.success("Administrador Actualizado Correctamente.");
        cb && cb()
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function signUpAdminAction(id?: string) {
  return (user: Partial<User>, cb?: any) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await service.signUp({ ...user, roleId: "AD" });
        dispatch(setAdminAction({}));
        dispatch(loadAdminAction(id)());
        toast.success("Administrador Creado Correctamente.");
        cb && cb()
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
