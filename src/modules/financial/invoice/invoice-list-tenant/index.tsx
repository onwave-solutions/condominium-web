import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { invoiceSelector } from "../../../../shared-ui/store/selectors/invoice.selector";
import { select } from "../../../../shared-ui/store/selectors";
import { managerSelector } from "../../../../shared-ui/store/selectors/manager.selector";
import {
  useReduxState,
  useReduxAction
} from "../../../../shared-ui/store/hooks";
import { IModule } from "../../../../shared-ui/models/module";
import {
  getInvoiceListAction,
  setInvoiceAction,
  resetInvoiceAction,
  updateInvoiceServiceAction,
  getInvoicesByApartmentIdAction
} from "../../../../shared-ui/store/actions/invoice.actions";
import { Invoice } from "../../../../shared-ui/models/invoice.model";

import { appSelector } from "../../../../shared-ui/store/selectors/app";
import InvoiceListView from "../../../../components/organisisms/invoice-list-view";
import { tenantSelector } from "../../../../shared-ui/store/selectors/tenant.selector";

const invoiceState = select(invoiceSelector);
const tenantState = select(tenantSelector);
const appState = select(appSelector);

export default function InvoiceModule(props: IModule) {
  const apartment = useReduxState(tenantState("apartment"));
  const invoices = useReduxState(invoiceState("invoices"));
  const keylist = useReduxState(appState("keylist"));

  const getInvoiceList = useReduxAction(getInvoicesByApartmentIdAction);
  const setInvoice = useReduxAction(setInvoiceAction);
  const onResetInvoice = useReduxAction(resetInvoiceAction);
  const updateInvoice = useReduxAction(updateInvoiceServiceAction(props.id));

  const onClickViewInvoice = (invoice: Invoice) => () => {
    //setInvoice({ ...invoice });
    props.history.push(`/invoice-view/${invoice.id}`);
  };

  useEffect(() => {
    getInvoiceList(apartment.id!);
  }, [apartment.id]);

  return (
    <InvoiceListView
      invoices={invoices}
      keylist={keylist}
      onClickViewInvoice={onClickViewInvoice}
      hideInvoiceEditor={true}
      refetch={() => getInvoiceList(apartment.id!)}
    />
  );
}
