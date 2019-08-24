import { IModule } from "../../shared-ui/models/module";

import expenses from "./expenses/module";
import invoices from "./invoices/module";
import payments from "./payments/module";
import apartments from "./apartments/module";
import financial from "./financial/module";

export default {
  title: "Reportes",
  id: "reports",
  iconType: "lock",
  children: [expenses, invoices, payments, apartments, financial]
} as IModule;
