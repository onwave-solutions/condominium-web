import { combineReducers, Reducer } from "redux";

import appReducer from "./app";
import userReducer from "./user";
import condominiumReducer from "./condominium";
import buildingReducer from "./building";
import apartmentReducer from "./apartment";

const reducer = combineReducers({
  app: appReducer,
  condominium: condominiumReducer,
  building: buildingReducer,
  apartment: apartmentReducer,
  user: userReducer
});

export type RootState = typeof reducer extends Reducer<infer S> ? S : never;

export default reducer;
