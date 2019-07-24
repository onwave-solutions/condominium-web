import { produce } from "immer";

import { Action } from "../../models/redux";
import { DashboardActions } from "../actions/dashboard.action";

export type IDashboardState = {
  dashboard: any;
};

const initialState: Readonly<IDashboardState> = {
  dashboard: {},
};

function reducer(action: Action<DashboardActions, any>) {
  return (draft: IDashboardState) => {
    switch (action.type) {
      case DashboardActions.SetDashboard:
        draft.dashboard = action.payload;
        break;
      default:
    }
  };
}

export default function dashboardReducer(
  state: IDashboardState = initialState,
  action: any
): IDashboardState {
  return produce(state, reducer(action));
}
