import { produce } from "immer";

import { Action } from "../../models/redux";
import { User } from "../../models/user";
import { ManagerActions } from "../actions/manager.action";
import { Condominium } from "../../models/condominium";

export type IManagerState = {
  manager: Partial<User>;
  managers: User[];
  condominium: Partial<Condominium>;
  condominiums: Condominium[];
};

const initialState: Readonly<IManagerState> = {
  manager: {},
  managers: [],
  condominium: {},
  condominiums: []
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
      case ManagerActions.SetCondominium:
        draft.condominium = action.payload;
        break;
      case ManagerActions.SetCondominiums:
        draft.condominiums = action.payload;
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
