import { produce } from "immer";

import { Action } from "../../models/redux";
import { User } from "../../models/user";
import { TenantActions } from "../actions/tenant.action";

export type ITenantState = {
  tenant: Partial<User>;
  tenants: User[];
};

const initialState: Readonly<ITenantState> = {
  tenant: {},
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
