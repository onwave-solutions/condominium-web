import React, { useEffect } from "react";
import { IModule } from "../../../../shared-ui/models/module";
import BladeTemplate from "../../../../components/templates/blade-template";
import {
  useReduxState,
  useReduxAction
} from "../../../../shared-ui/store/hooks";
import { invoiceSelector } from "../../../../shared-ui/store/selectors/invoice.selector";
import { select } from "../../../../shared-ui/store/selectors";
import { getInvoiceByIdAction } from "../../../../shared-ui/store/actions/invoice.actions";

import InvoiceComponent from "./component";
import Button from "../../../../components/atoms/button";

const invoiceState = select(invoiceSelector);

export default function InvoiceView(props: IModule) {
  const { match } = props;
  const invoice = useReduxState(invoiceState("invoice"));
  const getInvoiceById = useReduxAction(getInvoiceByIdAction(props.id));

  const onClickPayInvoice = () => {
    props.history.push(`/payment/${invoice.id}`);
  };

  useEffect(() => {
    if (match && match.params && match.params.id) {
      getInvoiceById(match.params.id);
    }
  }, []);

  return (
    <BladeTemplate
      header={
        <>
          <Button onClick={onClickPayInvoice}>Pagar</Button>
        </>
      }
    >
      {invoice.id && <InvoiceComponent invoice={invoice} />}
    </BladeTemplate>
  );
}
