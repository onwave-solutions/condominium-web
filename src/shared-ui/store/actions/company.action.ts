import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { Company } from "../../models/company.model";
import { createAction } from "../../utils/redux";
import { CompanyService } from "../../services/company.service";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";

export enum CompanyActions {
  SetCompany = "SET_COMPANY",
  SetCompanies = "SET_COMPANIES"
}

const service = new CompanyService();

export function setCompanyAction(payload: Partial<Company>) {
  return createAction(CompanyActions.SetCompany, payload);
}

export function setCompanysAction(payload: Company[]) {
  return createAction(CompanyActions.SetCompanies, payload);
}

export function loadCompaniesAction(id?: string) {
  return () =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.query({});
        dispatch(setCompanysAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function createCompanyAction(id?: string) {
  return (payload: Partial<Company>, cb?: () => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.create(payload);
        dispatch(setCompanyAction({}));
        dispatch(loadCompaniesAction(id)());
        toast.success("Compañia Actualizada Correctamente.");
        cb && cb();
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function updateCompanyAction(id?: string) {
  return (payload: Partial<Company>, cb?: () => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.update(payload.id!, payload);
        dispatch(setCompanyAction(data));
        dispatch(loadCompaniesAction(id)());
        toast.success("Compañia Actualizada Correctamente.");
        cb && cb();
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
