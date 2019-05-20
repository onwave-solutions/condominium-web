import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { createAction } from "../../utils/redux";
import { User } from "../../models/user";
import { UserService } from "../../services/users";

export enum TenantActions {
  SetTenant = "SET_TENANT",
  SetTenants = "SET_TENANTS"
}

const service = new UserService();

export function setTenantAction(payload: Partial<User>) {
  return createAction(TenantActions.SetTenant, payload);
}

export function setTenantsAction(payload: User[]) {
  return createAction(TenantActions.SetTenants, payload);
}

export function loadTenantAction(id?: string) {
  return () => async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await service.query({ roleId: "TE" });
      dispatch(setTenantsAction(data));
    } catch (e) {}
  };
}

export function updateTenantAction(id?: string) {
  return (user: Partial<User>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.update(user.id!, user);
      dispatch(setTenantAction(data));
      dispatch(loadTenantAction(id)());
      dispatch(loadTenantAction(id)());
      toast.success("Inquilino Actualizado Correctamente.");
    } catch (e) {}
  };
}

export function signUpTenantAction(id?: string) {
  return (user: Partial<User>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.signUp({ ...user, roleId: "TE" });
      dispatch(setTenantAction(data));
      dispatch(loadTenantAction(id)());
      toast.success("Inquilino Creado Correctamente.");
    } catch (e) {}
  };
}
