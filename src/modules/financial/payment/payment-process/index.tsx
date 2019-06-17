import React, { useEffect } from "react";
import { IModule } from "../../../../shared-ui/models/module";
import BladeTemplate from "../../../../components/templates/blade-template";
import { select } from "../../../../shared-ui/store/selectors";
import { appSelector } from "../../../../shared-ui/store/selectors/app";
import {
  useReduxState,
  useReduxAction
} from "../../../../shared-ui/store/hooks";
import { paymentSelector } from "../../../../shared-ui/store/selectors/payment.selector";
import InvoicePaymentForm from "../../../../components/organisisms/invoice-payment-form";
import { managerSelector } from "../../../../shared-ui/store/selectors/manager.selector";

const appState = select(appSelector);
const managerState = select(managerSelector);
const paymentState = select(paymentSelector);

export default function InvoicePayment(props: IModule) {
  const condominium = useReduxState(managerState("condominium"));
  const keylist = useReduxState(appState("keylist"));
  const invoices = useReduxState(paymentState("invoices"));
  const payment = useReduxState(paymentState("payment"));

  useEffect(() => {}, [condominium.id]);

  return (
    <BladeTemplate>
      <InvoicePaymentForm
        keylist={keylist}
        invoiceList={invoices}
        payment={payment}
      />
    </BladeTemplate>
  );
}
