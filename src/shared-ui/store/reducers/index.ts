import { combineReducers, Reducer } from "redux";

import appReducer from "./app";
import userReducer from "./user";
import condominiumReducer from "./condominium.reducer";
import buildingReducer from "./building";
import apartmentReducer from "./apartment";
import adminReducer from "./admin.reducer";
import managerReducer from "./manager.reducer";
import tenantReducer from "./tenant.reducer";
import companyReducer from "./company.reducer";

const reducer = combineReducers({
  app: appReducer,
  manager: managerReducer,
  tenant: tenantReducer,
  admin: adminReducer,
  company: companyReducer,
  condominium: condominiumReducer,
  building: buildingReducer,
  apartment: apartmentReducer,
  user: userReducer
});

export type RootState = typeof reducer extends Reducer<infer S> ? S : never;

export default reducer;
