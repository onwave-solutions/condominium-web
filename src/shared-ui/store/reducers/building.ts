import { produce } from "immer";

import { Action } from "../../models/redux";
import { Building } from "../../models/building";
import { BuildingActions } from "../actions/building";

export type IBuildingState = {
  building: Partial<Building>;
  buildings: Building[];
};

const initialState: Readonly<IBuildingState> = {
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
