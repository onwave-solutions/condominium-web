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
    ...tenant
  });

  return data;
}

export function setTenantAction(payload: Partial<User>) {
  return createAction(TenantActions.SetTenant, payload);
}

export function removeApartmentFromTenant(id?: string, condominiumId?: number) {
  return (tenantId: number, apartmentId: number, cb?: () => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await apartmentService.removeTenant(tenantId, apartmentId);
        const tenant = await tenantService.findOne(tenantId);
        dispatch(setTenantAction(tenant));
        dispatch(loadTenantAction(id)(condominiumId!));
        toast.success("Apartamento Removido correctamente");
        cb && cb();
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function addApartmentToTenant(id?: string, condominiumId?: number) {
  return (tenantId: number, apartmentId: number, cb?: () => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        await apartmentService.addTenant(tenantId, apartmentId);
        const tenant = await tenantService.findOne(tenantId);
        dispatch(setTenantAction(tenant));
        dispatch(loadTenantAction(id)(condominiumId!));
        cb && cb();
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
      const defaultApartment = await tenantService.getDefaultApartmentByTenantId(
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

export function updateTenantAction(id?: string, condominiumId?: number) {
  return (user: Partial<User>, cb?: () => void) =>
    loadingWrapper(async (dispatch: ThunkDispatch<any, any, any>) => {
      try {
        const data = await service.update(user.id!, user);
        dispatch(setTenantAction(data));
        dispatch(loadTenantAction(id)(condominiumId!));
        toast.success("Inquilino Actualizado Correctamente.");
        const tenant = await tenantService.findOne(user.id!);
        dispatch(setTenantAction(tenant));
        cb && cb();
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}

export function signUpTenantAction(id?: string, condominiumId?: number) {
  return (user: Partial<User>, cb?: () => void) =>
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
        cb && cb();
      } catch (e) {
        const error = getErrorResponse(e);
        toast.error(error.message);
      }
    });
}
