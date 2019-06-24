import { pipe } from "lodash/fp";
import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";

import { createAction } from "../../utils/redux";
//import { User, IAuthorization } from '../../models/user'
import { getErrorResponse } from "../../utils/objects";
import { Keylist } from "../../models/keylist";
import { UserService } from "../../services/users";
// import {
//   signIn,
//   validateUser,
//   sendChangePasswordCode,
//   sendChangePassword,
//   restoreSession,
// } from '../../http/user'
import { setAuthorization } from "../../services/axios";
import { IAuthorization, User } from "../../models/user";
import { setCondominiumToManagerAction } from "./manager.action";
import { setApartmentAction } from "./tenant.action";

export enum ApplicationActions {
  SetPath = "APPLICATION_SET_PATH",
  SetLoading = "APPLICATION_SET_LOADING",
  AddBlade = "APPLICATION_ADD_BLADE",
  AddChildBlade = "APPLICATION_ADD_CHILD_BLADE",
  ToggleBladeSize = "APPLICATION_TOGGLE_BLADE_SIZE",
  CloseBlade = "APPLICATION_CLOSE_BLADE",
  CloseChildBlades = "APPLICATION_CLOSE_CHILD_BLADES",
  FocusBlade = "APPLICATION_FOCUS_BLADE",
  SetSideBarVisibility = "APPLICATION_SET_SIDE_BAR_VISIBILITY",
  SetIsMobile = "APPLICATION_SET_IS_MOBILE",
  SetUser = "APPLICATION_SET_USER",
  SetKeyList = "APPLICATION_SET_KEYLIST"
}

const service = new UserService();

export function closeChildBladeAction(id: string) {
  return createAction(ApplicationActions.CloseChildBlades, id);
}

export function setKeylistAction(keylist: Keylist) {
  return createAction(ApplicationActions.SetKeyList, keylist);
}

export function loadKeylistAction() {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await service.keylist();
      dispatch(setKeylistAction(data));
    } catch (e) {}
  });
}

export function logoutAction() {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    sessionStorage.removeItem("token");
    dispatch(setCondominiumToManagerAction({}));
    dispatch(setApartmentAction({}));
    return dispatch(setUser({}));
  };
}

export function restoreSessionAction() {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
      setAuthorization(token);
      const user = await service.restoreSession();
      user.token = token;
      dispatch(setUser(user));
    } catch (e) {
      sessionStorage.removeItem("token");
    }
  });
}

// export function onSendChangePassword(auth: IAuthorization) {
//   return async (dispatch: ThunkDispatch<any, any, any>) => {
//     dispatch(setUser({ loading: true, showCode: true }))
//     try {
//       await sendChangePassword(auth)
//       toast.success('Contraseña actualizada exitosamente.')
//       dispatch(onLogin(auth))
//     } catch (e) {
//       const error = getErrorResponse(e)
//       toast.error(error.message)
//       dispatch(setUser({ loading: false, showCode: true }))
//     }
//   }
// }

// export function onSendChangePasswordCode(auth: IAuthorization) {
//   return async (dispatch: ThunkDispatch<any, any, any>) => {
//     dispatch(setUser({ loading: true }))
//     try {
//       await sendChangePasswordCode(auth)
//       toast.success('Código de verificación enviado a su email.')
//       dispatch(setUser({ loading: false, showCode: true }))
//     } catch (e) {
//       const error = getErrorResponse(e)
//       toast.error(error.message)
//       dispatch(setUser({ loading: false }))
//     }
//   }
// }

export function validateCodeAction(auth: IAuthorization) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      await service.confirmUser(auth);
      dispatch(setUser({}));
      toast.success("Usuario validado exitosamente. Favor iniciar sesión.");
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}

export function loginAction(auth: IAuthorization, cb?: () => void) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await service.signIn(auth);

      if (data.status === "P") {
        dispatch(setUser(data));
        toast.warn("Favor confirmar su usuario.");
        return;
      }

      sessionStorage.setItem("username", data.username!);
      sessionStorage.setItem("token", data.token!);
      setAuthorization(data.token!);
      dispatch(setUser(data));
      cb && cb();
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}

// export function setPath(payload: string) {
//   return createAction(ApplicationActions.SetPath, payload)
// }

export function setUser(user: Partial<User>) {
  return createAction(ApplicationActions.SetUser, user);
}

export function setIsMobile(payload: boolean) {
  return createAction(ApplicationActions.SetIsMobile, payload);
}

// export function focusBlade(payload: string) {
//   return createAction(ApplicationActions.FocusBlade, payload)
// }

export function setSideBarVisibility(payload: boolean) {
  return createAction(ApplicationActions.SetSideBarVisibility, payload);
}

export function addBlade(payload: string) {
  return createAction(ApplicationActions.AddBlade, payload);
}

export function addChildBlade(parentBlade: string) {
  return (childBlade: string) => {
    const payload = {
      parentBlade,
      childBlade
    };
    return createAction(ApplicationActions.AddChildBlade, payload);
  };
}

export function setLoadingAction(id: string) {
  return (loading: boolean) => {
    const payload = { id, loading };
    return createAction(ApplicationActions.SetLoading, payload);
  };
}

let counter = 0;

export function loadingWrapper(
  fn: (val: ThunkDispatch<any, any, any>) => void
) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    const loading = setLoadingAction("");
    try {
      counter++;
      dispatch(loading(true));
      await fn(dispatch);
    } finally {
      counter--;
      if (!counter) {
        dispatch(loading(false));
      }
    }
  };
}

// export function toggleBladeSize(payload: string) {
//   return createAction(ApplicationActions.ToggleBladeSize, payload)
// }

export function closeBlade(payload: string) {
  return createAction(ApplicationActions.CloseBlade, payload);
}
