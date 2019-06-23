import { produce } from "immer";

import { Action } from "../../models/redux";
import { User } from "../../models/user";
import { TenantActions } from "../actions/tenant.action";
import { Apartment } from "../../models/apartment";

export type ITenantState = {
  tenant: Partial<User>;
  tenants: User[];
  apartments: Apartment[];
  apartment: Apartment;
};

const initialState: Readonly<ITenantState> = {
  tenant: {},
  apartment: {},
  apartments: [],
  tenants: []
};

function reducer(action: Action<TenantActions, any>) {
  return (draft: ITenantState) => {
    switch (action.type) {
      case TenantActions.SetTenant:
        draft.tenant = action.payload;
        break;
      case TenantActions.SetTenants:
        draft.tenants = action.payload;
        break;
      case TenantActions.SetApartments:
        draft.apartments = action.payload;
        break;
      case TenantActions.SetApartment:
        draft.apartment = action.payload;
        break;
      default:
    }
  };
}

export default function apartmentReducer(
  state: ITenantState = initialState,
  action: any
): ITenantState {
  return produce(state, reducer(action));
}
