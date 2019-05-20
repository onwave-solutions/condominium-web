import { produce } from "immer";

import { Action } from "../../models/redux";
import { User } from "../../models/user";
import { AdminActions } from "../actions/admin.action";

export type IAdminState = {
  admin: Partial<User>;
  admins: User[];
};

const initialState: Readonly<IAdminState> = {
  admin: {},
  admins: []
};

function reducer(action: Action<AdminActions, any>) {
  return (draft: IAdminState) => {
    switch (action.type) {
      case AdminActions.SetAdmin:
        draft.admin = action.payload;
        break;
      case AdminActions.SetAdmins:
        draft.admins = action.payload;
        break;
      default:
    }
  };
}

export default function apartmentReducer(
  state: IAdminState = initialState,
  action: any
): IAdminState {
  return produce(state, reducer(action));
}
