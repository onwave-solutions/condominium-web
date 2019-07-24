import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";
import { createAction } from "../../utils/redux";
import { loadingWrapper } from "./app";
import { getErrorResponse } from "../../utils/objects";
import { dashboardByManager } from "../../services/dashboard.service";

export enum DashboardActions {
  SetDashboard = "dashboard/SET_DASHBOARD"
}

export function setDashboardAction(payload: any) {
  return createAction(DashboardActions.SetDashboard, payload);
}

export function loadDashboardAction() {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await dashboardByManager();
      dispatch(setDashboardAction(data));
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}
