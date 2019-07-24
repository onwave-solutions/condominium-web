import { IModule } from "../../shared-ui/models/module";
import invoiceList from "./invoice/invoice-list/module";
import invoiceEditor from "./invoice/invoice-editor/module";
import expenses from "../expenses/module";
import payments from "../payment-list/module";
import authorizations from "../authorization/module";
import transactions from "../transaction/module";

export default {
  title: "Gestión Financiera",
  id: "invoice-general",
  iconType: "lock",
  children: [
    invoiceEditor,
    invoiceList,
    authorizations,
    expenses,
    payments,
    transactions
  ]
} as IModule;
