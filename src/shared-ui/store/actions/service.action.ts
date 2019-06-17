import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { Service } from "../../models/service.model";
import { createAction } from "../../utils/redux";
import { ServiceService } from "../../services/service.service";

export enum ServiceActions {
  SetService = "SERVICE_SET_SERVICE",
  SetServices = "SERVICE_SET_SERVICES"
}

const service = new ServiceService();

export function setServiceAction(payload: Partial<Service>) {
  return createAction(ServiceActions.SetService, payload);
}

export function setServicesAction(payload: Service[]) {
  return createAction(ServiceActions.SetServices, payload);
}

export function loadServicesAction(id?: string) {
  return (payload: Partial<Service>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.query(payload);
      dispatch(setServicesAction(data));
    } catch (e) {}
  };
}

export function createServiceAction(id?: string) {
  return (payload: Partial<Service>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.create(payload);
      dispatch(setServiceAction(data));
      dispatch(
        loadServicesAction(id)({ condominiumId: payload.condominiumId })
      );
      toast.success("Servicio creado Correctamente.");
    } catch (e) {}
  };
}

export function updateServiceAction(id?: string) {
  return (payload: Partial<Service>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.update(payload.id!, payload);
      dispatch(setServiceAction(data));
      dispatch(
        loadServicesAction(id)({ condominiumId: payload.condominiumId })
      );
      toast.success("Servicio Actualizado Correctamente.");
    } catch (e) {}
  };
}
