import { pipe } from "lodash/fp";
import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";

import { createAction } from "../../utils/redux";
//import { User, IAuthorization } from '../../models/user'
import { getErrorResponse } from "../../utils/objects";
// import {
//   signIn,
//   validateUser,
//   sendChangePasswordCode,
//   sendChangePassword,
//   restoreSession,
// } from '../../http/user'
// import { setAuthorization } from '../../http'

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
  SetUser = "APPLICATION_SET_USER"
}

export function closeChildBladeAction(id: string) {
  return createAction(ApplicationActions.CloseChildBlades, id);
}

// export function logout() {
//   sessionStorage.removeItem('token')
//   return setUser({})
// }

// export function onRestoreSession() {
//   return async (dispatch: ThunkDispatch<any, any, any>) => {
//     const token = sessionStorage.getItem('token')
//     if (!token) return
//     dispatch(setUser({ loading: true }))
//     try {
//       setAuthorization(token)
//       const user = await restoreSession()
//       user.token = token
//       dispatch(setUser(user))
//     } catch (e) {
//       sessionStorage.removeItem('token')
//       dispatch(setUser({ loading: false }))
//     }
//   }
// }

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

// export function onValidateCode(auth: IAuthorization) {
//   return async (dispatch: ThunkDispatch<any, any, any>) => {
//     dispatch(setUser({ loading: true, showCode: true }))
//     try {
//       await validateUser(auth)
//       toast.success('Usuario validado exitosamente. Favor iniciar sesión.')
//       dispatch(setUser({ loading: false }))
//     } catch (e) {
//       const error = getErrorResponse(e)
//       toast.error(error.message)
//       dispatch(setUser({ loading: false, showCode: true }))
//     }
//   }
// }

// export function onLogin(auth: IAuthorization) {
//   return async (dispatch: ThunkDispatch<any, any, any>) => {
//     dispatch(setUser({ loading: true }))
//     try {
//       const data = await signIn(auth)
//       if (!data) {
//         toast.info(
//           'Usuario inactivo, favor buscar el código de verificación enviado a su correo y activar su usuario.'
//         )
//         return dispatch(setUser({ showCode: true }))
//       }
//       sessionStorage.setItem('email', data.email!)
//       sessionStorage.setItem('token', data.token!)
//       setAuthorization(data.token!)
//       dispatch(setUser(data))
//     } catch (e) {
//       const error = getErrorResponse(e)
//       toast.error(error.message)
//       dispatch(setUser({ loading: false }))
//     }
//   }
// }

// export function setPath(payload: string) {
//   return createAction(ApplicationActions.SetPath, payload)
// }

// export function setUser(user: Partial<User>) {
//   return createAction(ApplicationActions.SetUser, user)
// }

// export function setIsMobile(payload: boolean) {
//   return createAction(ApplicationActions.SetIsMobile, payload)
// }

// export function focusBlade(payload: string) {
//   return createAction(ApplicationActions.FocusBlade, payload)
// }

// export function setSideBarVisibility(payload: boolean) {
//   return createAction(ApplicationActions.SetSideBarVisibility, payload)
// }

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

export function setLoading(id: string) {
  return (loading: boolean) => {
    const payload = { id, loading };
    return createAction(ApplicationActions.SetLoading, payload);
  };
}

// export function toggleBladeSize(payload: string) {
//   return createAction(ApplicationActions.ToggleBladeSize, payload)
// }

export function closeBlade(payload: string) {
  return createAction(ApplicationActions.CloseBlade, payload);
}
