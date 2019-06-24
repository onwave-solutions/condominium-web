import { useEffect, useState } from "react";
import { User } from "../../shared-ui/models/user";
import { Apartment } from "../../shared-ui/models/apartment";
import { tenantSelector } from "../../shared-ui/store/selectors/tenant.selector";
import { select } from "../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import {
  loadTenantApartmentsAction,
  setApartmentAction,
  setDefaultApartment
} from "../../shared-ui/store/actions/tenant.action";

const tenantState = select(tenantSelector);

export default function useTenantApartment(
  user: User
): [Apartment[], Apartment, (value: Apartment) => void] {
  if (!user.id || user.roleId !== "TE") return [[], {}, () => undefined];
  const apartments = useReduxState(tenantState("apartments"));
  const apartment = useReduxState(tenantState("apartment"));

  const getApartmentsByTenantId = useReduxAction(loadTenantApartmentsAction);
  const setApartment = useReduxAction(setApartmentAction);

  useEffect(() => {
    getApartmentsByTenantId(user.id!);
  }, []);

  useEffect(() => {
    if (!apartment.id) return;
    setDefaultApartment({ apartmentId: apartment.id, tenantId: user.id });
  }, [apartment.id]);

  return [apartments, apartment, setApartment];
}
