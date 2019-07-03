import React from "react";
import FormItem from "../../molecules/form-item";
import { Invoice } from "../../../shared-ui/models/invoice.model";
import Select from "../../atoms/select";
import { Keylist } from "../../../shared-ui/models/keylist";
import { Payment } from "../../../shared-ui/models/payment.model";

export interface IInvoicePaymentForm {
  payment: Payment;
  keylist: Keylist;
  invoiceList: Invoice[];
  invoiceChanged?(invoice: Invoice): void;
}

function InvoiceNode(props: Invoice) {
  return <span key={props.sequence}>{props.apartmentId}</span>;
}

export default function InvoicePaymentForm(props: IInvoicePaymentForm) {
  const { payment, keylist, invoiceList } = props;
  return (
    <>
      <FormItem label="Factura" sm={24} md={24}>
        <Select
          name="invoiceId"
          data={invoiceList}
          typeName="id"
          value={payment.invoiceId}
          renderNode={InvoiceNode}
        />
      </FormItem>
      <FormItem label="Método de Pago" sm={24} md={24}>
        <Select
          name="paymentMethodType"
          data={keylist!.paymentMethods}
        />
      </FormItem>
    </>
  );
}
