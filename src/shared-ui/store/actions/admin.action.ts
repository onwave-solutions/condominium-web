import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { createAction } from "../../utils/redux";
import { User } from "../../models/user";
import { UserService } from "../../services/users";

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
  return () => async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await service.query({ roleId: "AD" });
      dispatch(setAdminsAction(data));
    } catch (e) {}
  };
}

export function updateAdminAction(id?: string) {
  return (user: Partial<User>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.update(user.id!, user);
      dispatch(setAdminAction(data));
      dispatch(loadAdminAction(id)());
      toast.success("Administrador Actualizado Correctamente.");
    } catch (e) {}
  };
}

export function signUpAdminAction(id?: string) {
  return (user: Partial<User>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.signUp({ ...user, roleId: "AD" });
      dispatch(setAdminAction(data));
      dispatch(loadAdminAction(id)());
      toast.success("Administrador Creado Correctamente.");
    } catch (e) {}
  };
}
