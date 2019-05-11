import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";

import { createAction } from "../../utils/redux";
import { Apartment } from "../../models/apartment";
import {
  updateApartment,
  createApartment,
  getApartment
} from "../../services/apartment";

export enum ApartmentActions {
  SetApartment = "APARTMENT_SET_APARTMENT",
  SetApartments = "APARTMENT_SET_APARTMENTS"
}

export function setApartmentAction(payload: Partial<Apartment>) {
  return createAction(ApartmentActions.SetApartment, payload);
}

export function setApartmentsAction(payload: Apartment[]) {
  return createAction(ApartmentActions.SetApartments, payload);
}

export function updateApartmentAction(id?: string) {
  return (apartment: Partial<Apartment>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await updateApartment(apartment.id!, apartment);
      dispatch(setApartmentAction(data));
      toast.success("Apartamento Actualizado Correctamente");
      dispatch(
        refreshApartmentsAction(id)({
          buildingId: apartment.buildingId
        })
      );
    } catch (e) {}
  };
}

export function createApartmentAction(id?: string) {
  return (apartment: Partial<Apartment>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await createApartment(apartment);
      dispatch(setApartmentAction(data));
      toast.success("Apartamento Creado Correctamente");
      dispatch(
        refreshApartmentsAction(id)({
          buildingId: apartment.buildingId
        })
      );
    } catch (e) {}
  };
}

export function refreshApartmentsAction(id?: string) {
  return (payload: Partial<Apartment>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await getApartment({ buildingId: payload.buildingId });
      dispatch(setApartmentsAction(data));
    } catch (e) {}
  };
}
