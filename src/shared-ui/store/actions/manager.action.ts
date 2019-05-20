import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { createAction } from "../../utils/redux";
import { User } from "../../models/user";
import { UserService } from "../../services/users";

export enum ManagerActions {
  SetManager = "SET_MANAGER",
  SetManagers = "SET_MANAGERS"
}

const service = new UserService();

export function setManagerAction(payload: Partial<User>) {
  return createAction(ManagerActions.SetManager, payload);
}

export function setManagersAction(payload: User[]) {
  return createAction(ManagerActions.SetManagers, payload);
}

export function loadManagerAction(id?: string) {
  return () => async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await service.query({ roleId: "MA" });
      dispatch(setManagersAction(data));
    } catch (e) {}
  };
}

export function updateManagerAction(id?: string) {
  return (user: Partial<User>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.update(user.id!, user);
      dispatch(setManagerAction(data));
      dispatch(loadManagerAction(id)());
      dispatch(loadManagerAction(id)());
      toast.success("Manager Actualizado Correctamente.");
    } catch (e) {}
  };
}

export function signUpManagerAction(id?: string) {
  return (user: Partial<User>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.signUp({ ...user, roleId: "MA" });
      dispatch(setManagerAction(data));
      dispatch(loadManagerAction(id)());
      toast.success("Manager Creado Correctamente.");
    } catch (e) {}
  };
}
