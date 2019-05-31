import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { Company } from "../../models/company.model";
import { createAction } from "../../utils/redux";
import { CompanyService } from "../../services/company.service";

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
  return () => async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      const data = await service.query({});
      dispatch(setCompanysAction(data));
    } catch (e) {}
  };
}

export function createCompanyAction(id?: string) {
  return (payload: Partial<Company>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.create(payload);
      dispatch(setCompanyAction(data));
      dispatch(loadCompaniesAction(id)());
      dispatch(loadCompaniesAction(id)());
      toast.success("Compañia Actualizada Correctamente.");
    } catch (e) {}
  };
}

export function updateCompanyAction(id?: string) {
  return (payload: Partial<Company>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await service.update(payload.id!, payload);
      dispatch(setCompanyAction(data));
      dispatch(loadCompaniesAction(id)());
      toast.success("Compañia Actualizada Correctamente.");
    } catch (e) {}
  };
}
