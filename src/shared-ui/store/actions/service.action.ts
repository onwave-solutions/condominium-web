import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { Service } from "../../models/service.model";
import { createAction } from "../../utils/redux";
import { ServiceService } from "../../services/service.service";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";
import { ApartmentService } from "../../services/apartment";

export enum ServiceActions {
  SetService = "SERVICE_SET_SERVICE",
  SetServices = "SERVICE_SET_SERVICES"
}

const service = new ServiceService();
const apartmentService = new ApartmentService();

export function setServiceAction(payload: Partial<Service>) {
  return createAction(ServiceActions.SetService, payload);
}

export function setServicesAction(payload: Service[]) {
  return createAction(ServiceActions.SetServices, payload);
}

export function loadServicesAction(id?: string) {
  return (payload: Partial<Service>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.query(payload, { name: "ASC" });
        dispatch(setServicesAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function createServiceAction(id?: string) {
  return (payload: Partial<Service>, cb: any) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.create(payload);
        dispatch(
          loadServicesAction(id)({ condominiumId: payload.condominiumId })
        );
        dispatch(setServiceAction({}));
        toast.success("Servicio creado Correctamente.");
        cb && cb()
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function bulkAssignServiceAction(id?: string) {
  return (payload: Partial<Service>, cb?: any) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await apartmentService.bulk(payload);
        dispatch(setServiceAction({ condominiumId: payload.condominiumId }));
        dispatch(
          loadServicesAction(id)({ condominiumId: payload.condominiumId })
        );
        toast.success("Servicio Actualizado Correctamente.");
        cb && cb()
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function deleteServiceAction(payload: Partial<Service>) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      await service.delete(payload.id!);
      dispatch(
        setServiceAction({
          condominiumId: payload.condominiumId
        })
      );
      dispatch(
        loadServicesAction()({
          condominiumId: payload.condominiumId,
          deprecated: false
        })
      );
      toast.success("Servicio Eliminado Correctamente.");
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}

export function updateServiceAction(id?: string) {
  return (payload: Partial<Service>, cb?: any) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.update(payload.id!, payload);
        dispatch(setServiceAction({ condominiumId: data.condominiumId }));
        dispatch(
          loadServicesAction(id)({ condominiumId: payload.condominiumId })
        );
        toast.success("Servicio Actualizado Correctamente.");
        cb && cb()
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
