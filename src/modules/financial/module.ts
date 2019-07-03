import { IModule } from "../../shared-ui/models/module";
import invoiceList from "./invoice/invoice-list/module";
import invoiceEditor from "./invoice/invoice-editor/module";
import expenses from '../expenses/module'

export default {
  title: "Gestión Financiera",
  id: "invoice-general",
  iconType: "lock",
  children: [invoiceEditor, invoiceList, expenses]
} as IModule;
