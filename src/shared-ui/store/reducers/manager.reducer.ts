import { produce } from "immer";

import { Action } from "../../models/redux";
import { User } from "../../models/user";
import { ManagerActions } from "../actions/manager.action";

export type IManagerState = {
  manager: Partial<User>;
  managers: User[];
};

const initialState: Readonly<IManagerState> = {
  manager: {},
  managers: []
};

function reducer(action: Action<ManagerActions, any>) {
  return (draft: IManagerState) => {
    switch (action.type) {
      case ManagerActions.SetManager:
        draft.manager = action.payload;
        break;
      case ManagerActions.SetManagers:
        draft.managers = action.payload;
        break;
      default:
    }
  };
}

export default function apartmentReducer(
  state: IManagerState = initialState,
  action: any
): IManagerState {
  return produce(state, reducer(action));
}
