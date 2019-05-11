import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";

// import { User, UserKeylist } from '../../models/user'
import { createAction } from "../../utils/redux";
import { ApplicationActions } from "./app";
import { getErrorResponse } from "../../utils/objects";
// import { getUserList, getUserKeylist, signUp, updateUser } from '../../http/user'
import { validateEmail } from "../../utils/strings";

export enum UserActions {
  SetUser = "SET_USER",
  SetKeylist = "SET_KEYLIST",
  SetUsers = "SET_USERS"
}

// export function setUsers(users: User[]) {
//   return createAction(UserActions.SetUsers, users)
// }

// export function setKeylist(keylist: UserKeylist) {
//   return createAction(UserActions.SetKeylist, keylist)
// }

// export function setUser(user: Partial<User>) {
//   return createAction(UserActions.SetUser, user)
// }

// export function createUser(id: string) {
//   return (user: Partial<User>) => async (dispatch: ThunkDispatch<any, any, any>) => {
//     dispatch(createAction(ApplicationActions.SetLoading, { id, loading: true }))
//     try {
//       if (!validateEmail(user.email!)) {
//         toast.error('Email invalido')
//         return
//       }

//       const newUser = await signUp(user)
//       dispatch(setUser(newUser))
//       const users = await getUserList()
//       dispatch(setUsers(users))
//       toast.success('Usuario creado exitosamente.')
//     } catch (e) {
//       const error = getErrorResponse(e)
//       toast.error(error.message)
//     } finally {
//       dispatch(createAction(ApplicationActions.SetLoading, { id, loading: false }))
//     }
//   }
// }

// export function modifyUser(id: string) {
//   return (user: Partial<User>) => async (dispatch: ThunkDispatch<any, any, any>) => {
//     dispatch(createAction(ApplicationActions.SetLoading, { id, loading: true }))
//     try {
//       const newUser = await updateUser(user)
//       dispatch(setUser(newUser))
//       const users = await getUserList()
//       dispatch(setUsers(users))
//       toast.success('Usuario actualizado exitosamente.')
//     } catch (e) {
//       const error = getErrorResponse(e)
//       toast.error(error.message)
//     } finally {
//       dispatch(createAction(ApplicationActions.SetLoading, { id, loading: false }))
//     }
//   }
// }

// export function getInitialUserData(id: string) {
//   return () => async (dispatch: ThunkDispatch<any, any, any>) => {
//     dispatch(createAction(ApplicationActions.SetLoading, { id, loading: true }))
//     dispatch(setKeylist({ userTypes: [] }))
//     dispatch(setUser({}))
//     dispatch(setUsers([]))
//     try {
//       const [keylist, users] = await Promise.all([getUserKeylist(), getUserList()])
//       dispatch(setKeylist(keylist))
//       dispatch(setUsers(users))
//     } catch (e) {
//       const error = getErrorResponse(e)
//       toast.error(error.message)
//     } finally {
//       dispatch(createAction(ApplicationActions.SetLoading, { id, loading: false }))
//     }
//   }
// }
