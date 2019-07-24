import React from "react";
import moment from "moment";

import { invoiceSelector } from "../../../../shared-ui/store/selectors/invoice.selector";
import { select } from "../../../../shared-ui/store/selectors";
import {
  useReduxState,
  useReduxAction
} from "../../../../shared-ui/store/hooks";
import { IModule } from "../../../../shared-ui/models/module";
import { getInvoicesByQueryAction } from "../../../../shared-ui/store/actions/invoice.actions";
import { Invoice } from "../../../../shared-ui/models/invoice.model";

import { appSelector } from "../../../../shared-ui/store/selectors/app";
import InvoiceListView from "../../../../components/organisisms/invoice-list-view";
import { tenantSelector } from "../../../../shared-ui/store/selectors/tenant.selector";
import { currencyFormat } from '../../../../shared-ui/utils/currency';

const invoiceState = select(invoiceSelector);
const tenantState = select(tenantSelector);
const appState = select(appSelector);

export default function InvoiceModule(props: IModule) {
  const apartment = useReduxState(tenantState("apartment"));
  const invoices = useReduxState(invoiceState("invoices"));
  const keylist = useReduxState(appState("keylist"));

  const getInvoiceList = useReduxAction(getInvoicesByQueryAction);
  const onClickViewInvoice = (invoice: Invoice) => () => {
    props.history.push(`/invoice-view/${invoice.id}`);
  };

  const refetch = (startDate: moment.Moment, endDate: moment.Moment) => () => {
    getInvoiceList({
      apartmentId: apartment.id,
      createdAt: {
        between: {
          end: endDate.toDate(),
          start: startDate.toDate()
        }
      }
    });
  };

  const onClickPayInvoice = (invoice: Invoice) => () => {
    props.history.push(`/payment/${invoice.id}`);
  };

  let formatter: any;
  if (apartment && apartment.building! && apartment.building!.condominium!) {
    formatter = currencyFormat(apartment.building!.condominium!);
  }

  return (
    <InvoiceListView
      invoices={invoices}
      resetKey={apartment.id}
      keylist={keylist}
      isTenant={true}
      formatter={formatter}
      onClickViewInvoice={onClickViewInvoice}
      hideInvoiceEditor={true}
      refetch={refetch}
      onClickPayInvoice={onClickPayInvoice}
    />
  );
}
