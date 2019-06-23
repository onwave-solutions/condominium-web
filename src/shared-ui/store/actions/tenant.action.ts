import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { createAction } from "../../utils/redux";
import { User } from "../../models/user";
import { UserService } from "../../services/users";
import { TenantService } from "../../services/tenant.service";
import { loadAdminAction } from "./admin.action";
import { ApartmentService } from "../../services/apartment";
import { AdvanceQuery } from "../../models/keylist";
import { Apartment, ApartmentTenant } from "../../models/apartment";
import { getErrorResponse } from "../../utils/objects";
import { loadingWrapper } from "./app";

export enum TenantActions {
  SetTenant = "tenant/SET_TENANT",
  SetTenants = "tenant/SET_TENANTS",
  SetApartments = "tenant/SET_APARTMENTS",
  SetApartment = "tenant/SET_APARTMENT"
}

const service = new UserService();
const tenantService = new TenantService();
const apartmentService = new ApartmentService();

export async function findTenantBy(
  tenant: AdvanceQuery<User>
): Promise<User[]> {
  const data = await service.query({
    ...tenant,
    roleId: "TE"
  });

  return data;
}

export function setTenantAction(payload: Partial<User>) {
  return createAction(TenantActions.SetTenant, payload);
}

export function addApartmentToTenant(id?: string, condominiumId?: number) {
  return (tenantId: number, apartmentId: number) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await apartmentService.addTenant(tenantId, apartmentId);
        const tenant = await tenantService.findOne(tenantId);
        dispatch(setTenantAction(tenant));
        dispatch(loadTenantAction(id)(condominiumId!));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function setApartments(payload: Apartment[]) {
  return createAction(TenantActions.SetApartments, payload);
}

export function setApartmentAction(payload: Apartment) {
  return createAction(TenantActions.SetApartment, payload);
}

export async function setDefaultApartment(payload: ApartmentTenant) {
  try {
    await tenantService.setDefaultApartmentToTenant(payload);
  } catch (e) {
    const error = getErrorResponse(e);
    toast.error(error.message);
  }
}

export function loadTenantApartmentsAction(tenantId: number) {
  return loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
    try {
      if (!tenantId) return;
      const apartments = await tenantService.getApartmentsByTenantId(tenantId);
      dispatch(setApartments(apartments));
      const defaultApartment = await apartmentService.getDefaultApartmentByTenantId(
        tenantId
      );
      dispatch(setApartmentAction(defaultApartment));
    } catch (e) {
      const error = getErrorResponse(e);
      toast.error(error.message);
    }
  });
}

export function setTenantsAction(payload: User[]) {
  return createAction(TenantActions.SetTenants, payload);
}

export function loadTenantAction(id?: string) {
  return (condominiumId: number) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      if (!condominiumId) return;
      try {
        const data = await tenantService.getTenantsByCondominiumId(
          condominiumId
        );
        dispatch(setTenantsAction(data));
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function updateTenantAction(id?: string) {
  return (user: Partial<User>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    // try {
    //   const data = await service.update(user.id!, user);
    //   dispatch(setTenantAction(data));
    //   dispatch(loadTenantAction(id)());
    //   dispatch(loadTenantAction(id)());
    //   toast.success("Inquilino Actualizado Correctamente.");
    // } catch (e) {}
  };
}

export function signUpTenantAction(id?: string, condominiumId?: number) {
  return (user: Partial<User>) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        if (!user.id) {
          const newUser = await service.signUp({ ...user, roleId: "TE" });
          await tenantService.addTenantToCondomium(newUser.id!, condominiumId!);
        } else {
          await tenantService.addTenantToCondomium(user.id!, condominiumId!);
        }
        dispatch(loadTenantAction(id)(condominiumId!));
        toast.success("Inquilino Creado Correctamente.");
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
