import { produce } from "immer";

import { Action } from "../../models/redux";
import { Condominium } from "../../models/condominium";
import { CondominiumActions } from "../actions/condominium.action";
import { User } from "../../models/user";

export type ICondominiumState = {
  condominium: Partial<Condominium>;
  condominiums: Condominium[];
  condominiumManagers: User[];
  manager: User;
};

const initialState: Readonly<ICondominiumState> = {
  manager: {},
  condominiumManagers: [],
  condominium: {},
  condominiums: []
};

function reducer(action: Action<CondominiumActions, any>) {
  return (draft: ICondominiumState) => {
    switch (action.type) {
      case CondominiumActions.SetCondominium:
        draft.condominium = action.payload;
        break;
      case CondominiumActions.SetCondominiums:
        draft.condominiums = action.payload;
        break;
      case CondominiumActions.SetCondominiumManagers:
        draft.condominiumManagers = action.payload;
        break;
      case CondominiumActions.SetManager:
        draft.manager = action.payload;
        break;
      default:
    }
  };
}

export default function condominiumReducer(
  state: ICondominiumState = initialState,
  action: any
): ICondominiumState {
  return produce(state, reducer(action));
}
