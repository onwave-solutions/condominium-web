import { ThunkDispatch } from "redux-thunk";
import { toast } from "react-toastify";
import { createAction } from "../../utils/redux";
import { User } from "../../models/user";
import { UserService } from "../../services/users";
import { TenantService } from "../../services/tenant.service";
import { loadAdminAction } from "./admin.action";
import { ApartmentService } from "../../services/apartment";

export enum TenantActions {
  SetTenant = "SET_TENANT",
  SetTenants = "SET_TENANTS"
}

const service = new UserService();
const tenantService = new TenantService();
const apartmentService = new ApartmentService();

export function setTenantAction(payload: Partial<User>) {
  return createAction(TenantActions.SetTenant, payload);
}

export function addApartmentToTenant(id?: string, condominiumId?: number) {
  return (tenantId: number, apartmentId: number) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      await apartmentService.addTenant(tenantId, apartmentId);
      const tenant = await service.findOne(tenantId);
      dispatch(setTenantAction(tenant));
      dispatch(loadTenantAction(id)(condominiumId!));
    } catch (e) {}
  };
}

export function setTenantsAction(payload: User[]) {
  return createAction(TenantActions.SetTenants, payload);
}

export function loadTenantAction(id?: string) {
  return (condominiumId: number) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      const data = await tenantService.getTenantsByCondominiumId(condominiumId);
      dispatch(setTenantsAction(data));
    } catch (e) {}
  };
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
  return (user: Partial<User>) => async (
    dispatch: ThunkDispatch<any, any, any>
  ) => {
    try {
      if (!user.id) {
        const newUser = await service.signUp({ ...user, roleId: "TE" });
        await tenantService.addTenantToCondomium(newUser.id!, condominiumId!);
      } else {
        await tenantService.addTenantToCondomium(user.id!, condominiumId!);
      }
      dispatch(loadTenantAction(id)(condominiumId!));
      toast.success("Inquilino Creado Correctamente.");
    } catch (e) {}
  };
}
