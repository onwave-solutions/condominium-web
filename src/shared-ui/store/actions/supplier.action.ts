import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { Supplier } from "../../models/supplier.model";
import { createAction } from "../../utils/redux";
import { SupplierService } from "../../services/supplier.service";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";

export enum SupplierActions {
  SetSupplier = "SUPPLIER_SET_SUPPLIER",
  SetSuppliers = "SUPPLIER_SET_SUPPLIERS"
}

const service = new SupplierService();

export function setSupplierAction(payload: Partial<Supplier>) {
  return createAction(SupplierActions.SetSupplier, payload);
}

export function setSuppliersAction(payload: Supplier[]) {
  return createAction(SupplierActions.SetSuppliers, payload);
}

export function loadSuppliersAction(id?: string) {
  return (payload: Partial<Supplier>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.query(payload);
        dispatch(setSuppliersAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function createSupplierAction(id?: string) {
  return (payload: Partial<Supplier>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.create(payload);
        dispatch(setSupplierAction({ condominiumId: data.condominiumId }));
        dispatch(
          loadSuppliersAction(id)({ condominiumId: payload.condominiumId })
        );
        toast.success("Suplidor creado Correctamente.");
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function updateSupplierAction(id?: string) {
  return (payload: Partial<Supplier>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.update(payload.id!, payload);
        dispatch(setSupplierAction(data));
        dispatch(
          loadSuppliersAction(id)({ condominiumId: payload.condominiumId })
        );
        toast.success("Suplidor Actualizado Correctamente.");
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
