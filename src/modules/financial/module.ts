import { IModule } from "../../shared-ui/models/module";
import invoiceList from "./invoice/invoice-list/module";
import invoiceEditor from "./invoice/invoice-editor/module";
import paymentProcess from "./payment/payment-process/module";

export default {
  title: "Gestión Financiera",
  id: "invoice-general",
  iconType: "lock",
  children: [invoiceEditor, invoiceList]
} as IModule;
