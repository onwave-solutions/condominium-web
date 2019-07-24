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
import { managerSelector } from "../../../../shared-ui/store/selectors/manager.selector";
import { currencyFormat } from "../../../../shared-ui/utils/currency";

const invoiceState = select(invoiceSelector);
const managerState = select(managerSelector);

export default function InvoiceView(props: IModule) {
  const { match } = props;
  const invoice = useReduxState(invoiceState("invoice"));
  const getInvoiceById = useReduxAction(getInvoiceByIdAction(props.id));
  const condominium = useReduxState(managerState("condominium"));

  const onClickPayInvoice = () => {
    props.history.push(`/payment/${invoice.id}`);
  };

  useEffect(() => {
    if (match && match.params && match.params.id) {
      getInvoiceById(match.params.id);
    }
  }, []);

  const formatter = currencyFormat(condominium);

  return (
    <BladeTemplate
      header={
        <>
          <Button onClick={onClickPayInvoice}>Pagar</Button>
        </>
      }
    >
      {invoice.id && (
        <InvoiceComponent invoice={invoice} formatter={formatter} />
      )}
    </BladeTemplate>
  );
}
