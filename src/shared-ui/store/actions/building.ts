import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";

import { createAction } from "../../utils/redux";
import { Building } from "../../models/building";
import {
  updateBuilding,
  createBuilding,
  getBuilding,
  BuildingService
} from "../../services/building";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";

import { CondominiumService } from "../../services/condominium.service";
import { Condominium } from "../../models/condominium";

export enum BuildingActions {
  SetCondominium = "building/SET_CONDOMINIUM",
  SetBuilding = "building/SET_BUILDING",
  SetBuildings = "building/SET_BUILDINGS"
}

const condominiumService = new CondominiumService();
const service = new BuildingService();

export function setBuildingAction(payload: Partial<Building>) {
  return createAction(BuildingActions.SetBuilding, payload);
}

export function setBuildingsAction(payload: Building[]) {
  return createAction(BuildingActions.SetBuildings, payload);
}

export function setCondominiumAction(payload: Condominium) {
  return createAction(BuildingActions.SetCondominium, payload);
}

export function findCondominiumByIdAction(id: number) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await condominiumService.findOne(id);
      dispatch(setCondominiumAction(data));
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
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
        const data = await service.query(
          {
            condominiumId: parseInt(`${payload.condominiumId}`, 10)
          },
          { name: "ASC" }
        );
        dispatch(setBuildingsAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
