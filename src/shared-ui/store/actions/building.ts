import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";

import { createAction } from "../../utils/redux";
import { Building } from "../../models/building";
import {
  updateBuilding,
  createBuilding,
  getBuilding
} from "../../services/building";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";

export enum BuildingActions {
  SetBuilding = "BUILDING_SET_BUILDING",
  SetBuildings = "BUILDING_SET_BUILDINGS"
}

export function setBuildingAction(payload: Partial<Building>) {
  return createAction(BuildingActions.SetBuilding, payload);
}

export function setBuildingsAction(payload: Building[]) {
  return createAction(BuildingActions.SetBuildings, payload);
}

export function updateBuildingAction(id?: string) {
  return (building: Partial<Building>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await updateBuilding(building.id!, building);
        dispatch(setBuildingAction(data));
        toast.success("Edificio Actualizado Correctamente");
        dispatch(
          refreshBuildingsAction(id)({
            condominiumId: building.condominiumId
          })
        );
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function createBuildingAction(id?: string) {
  return (building: Partial<Building>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await createBuilding(building);
        dispatch(setBuildingAction({ condominiumId: data.condominiumId }));
        toast.success("Edificio Creado Correctamente");
        dispatch(
          refreshBuildingsAction(id)({
            condominiumId: building.condominiumId
          })
        );
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function refreshBuildingsAction(id?: string) {
  return (payload: Partial<Building>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await getBuilding({
          condominiumId: parseInt(`${payload.condominiumId}`, 10)
        });
        dispatch(setBuildingsAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
