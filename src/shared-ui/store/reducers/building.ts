import { produce } from "immer";

import { Action } from "../../models/redux";
import { Building } from "../../models/building";
import { BuildingActions } from "../actions/building";
import { Condominium } from '../../models/condominium';

export type IBuildingState = {
  condominium: Condominium;
  building: Partial<Building>;
  buildings: Building[];
};

const initialState: Readonly<IBuildingState> = {
  condominium: {},
  building: {},
  buildings: []
};

function reducer(action: Action<BuildingActions, any>) {
  return (draft: IBuildingState) => {
    switch (action.type) {
      case BuildingActions.SetBuilding:
        draft.building = action.payload;
        break;
      case BuildingActions.SetBuildings:
        draft.buildings = action.payload;
        break;
      case BuildingActions.SetCondominium:
        draft.condominium = action.payload
        break
      default:
    }
  };
}

export default function buildingReducer(
  state: IBuildingState = initialState,
  action: any
): IBuildingState {
  return produce(state, reducer(action));
}
