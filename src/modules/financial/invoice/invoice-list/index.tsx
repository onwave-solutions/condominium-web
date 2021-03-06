import React, { useEffect, useState } from "react";
import moment from "moment";
import styled from "styled-components";

import Scrollbars from "../../../../components/atoms/scrollbar";
import BladeTemplate from "../../../../components/templates/blade-template";
import Table, { Column } from "../../../../components/atoms/table";
import Button from "../../../../components/atoms/button";
import Icon from "../../../../components/atoms/icon";
import { Wrapper, StatusTag } from "./invoice.style";
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
  updateInvoiceServiceAction
} from "../../../../shared-ui/store/actions/invoice.actions";
import { Invoice } from "../../../../shared-ui/models/invoice.model";
import { ColumnProps } from "antd/lib/table/interface";
import {
  addChildBlade,
  closeBlade
} from "../../../../shared-ui/store/actions/app";

import invoiceEditorModule from "../invoice-editor/module";
import invoiceViewModule from "../invoice-view/module";
import ColumnInputFilter from "../../../../components/molecules/column-input-filter";
import ColumnSelectFilter from "../../../../components/molecules/column-select-filter";
import { appSelector } from "../../../../shared-ui/store/selectors/app";
import InvoiceListView from "../../../../components/organisisms/invoice-list-view";
import { currencyFormat } from "../../../../shared-ui/utils/currency";

const ScrollbarWrapper = styled(Scrollbars)``;

const invoiceState = select(invoiceSelector);
const managerState = select(managerSelector);
const appState = select(appSelector);

export default function InvoiceModule(props: IModule) {
  const condominium = useReduxState(managerState("condominium"));
  const invoices = useReduxState(invoiceState("invoices"));
  const keylist = useReduxState(appState("keylist"));

  const getInvoiceList = useReduxAction(getInvoiceListAction(props.id));
  const setInvoice = useReduxAction(setInvoiceAction);
  const onResetInvoice = useReduxAction(resetInvoiceAction);
  const updateInvoice = useReduxAction(updateInvoiceServiceAction(props.id));

  const onVoidInvoice = (invoice: Invoice) => () => {
    updateInvoice(condominium.id!, {
      ...invoice,
      statusType: "AN"
    });
  };

  const onClickViewInvoice = (invoice: Invoice) => () => {
    window.open(
      `/invoice-view/${invoice.id}`,
      "winname",
      "directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no,width=600,height=550"
    );
  };

  const onClickEditInvoice = (invoice: Invoice) => () => {
    props.history.push(`/invoice-builder-detail/${invoice.id}`);
  };

  const onAddInvoice = () => {
    props.history.push(`/invoice-builder`);
    onResetInvoice();
  };

  const onClickPayInvoice = (invoice: Invoice) => () => {
    props.history.push(`/payment/${invoice.id}`);
  };

  const formatter = currencyFormat(condominium);

  const refetch = (startDate: moment.Moment, endDate: moment.Moment) => () => {
    getInvoiceList(condominium.id!, {
      createdAt: {
        between: {
          end: endDate.toDate(),
          start: startDate.toDate()
        }
      }
    });
  };

  return (
    <InvoiceListView
      invoices={invoices}
      resetKey={condominium.id}
      keylist={keylist}
      formatter={formatter}
      onClickPayInvoice={onClickPayInvoice}
      onAddInvoice={onAddInvoice}
      onClickEditInvoice={onClickEditInvoice}
      onClickViewInvoice={onClickViewInvoice}
      onVoidInvoice={onVoidInvoice}
      refetch={refetch}
    />
  );
}
