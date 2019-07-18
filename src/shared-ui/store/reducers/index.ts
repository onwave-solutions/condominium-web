import { combineReducers, Reducer } from "redux";

import appReducer from "./app";
import condominiumReducer from "./condominium.reducer";
import buildingReducer from "./building";
import apartmentReducer from "./apartment";
import adminReducer from "./admin.reducer";
import managerReducer from "./manager.reducer";
import tenantReducer from "./tenant.reducer";
import companyReducer from "./company.reducer";
import serviceReducer from "./service.reducer";
import supplierReducer from "./supplier.reducer";
import bankAccountReducer from "./bank-account.reducer";
import invoiceReducer from "./invoice.reducer";
import paymentReducer from "./payment.reducer";
import ticketReducer from "./ticket.reducer";
import expenseReducer from "./expense.reducer";
import newsFeeReducer from "./news-fee.reducer";
import transactionReducer from "./transaction.reducer";

const reducer = combineReducers({
  app: appReducer,
  newsFee: newsFeeReducer,
  expense: expenseReducer,
  bankAccount: bankAccountReducer,
  manager: managerReducer,
  tenant: tenantReducer,
  service: serviceReducer,
  supplier: supplierReducer,
  invoice: invoiceReducer,
  payment: paymentReducer,
  admin: adminReducer,
  company: companyReducer,
  condominium: condominiumReducer,
  building: buildingReducer,
  ticket: ticketReducer,
  apartment: apartmentReducer,
  transaction: transactionReducer
});

export type RootState = typeof reducer extends Reducer<infer S> ? S : never;

export default reducer;
