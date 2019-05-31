import { IModule } from "../../shared-ui/models/module";
import invoiceList from "./invoice/invoice-list/module";

export default {
  title: "Gestión Financiera",
  id: "invoice-general",
  iconType: "lock",
  children: [invoiceList]
} as IModule;
