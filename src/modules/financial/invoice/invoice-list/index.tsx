import React, { useEffect, useState } from "react";
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
import paymentBladeModule from "../../payment/payment-process/module";
import ColumnInputFilter from "../../../../components/molecules/column-input-filter";
import ColumnSelectFilter from "../../../../components/molecules/column-select-filter";
import { appSelector } from "../../../../shared-ui/store/selectors/app";
import InvoiceListView from "../../../../components/organisisms/invoice-list-view";

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
    //setInvoice({ ...invoice });
    props.history.push(`/invoice-view/${invoice.id}`);
  };

  const onClickEditInvoice = (invoice: Invoice) => () => {
    //handleAddBlade(invoiceEditorModule.id);
    //handleCloseBlade(invoiceViewModule.id);
    //setInvoice({ ...invoice });
    props.history.push(`/invoice-builder-detail/${invoice.id}`);
  };

  const onAddInvoice = () => {
    props.history.push(`/invoice-builder`);
    onResetInvoice();
  };

  const [searchText, setSearchText] = useState("");

  const handleSearch = (selectedKeys: string[], confirm: Function) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters: Function) => {
    clearFilters();
    setSearchText("");
  };

  const onFilter = (fn: (record: any) => any) => (value: any, record: any) =>
    fn(record)
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase());

  useEffect(() => {
    getInvoiceList(condominium.id!);
  }, [condominium.id]);

  return (
    <InvoiceListView
      invoices={invoices}
      keylist={keylist}
      onAddInvoice={onAddInvoice}
      onClickEditInvoice={onClickEditInvoice}
      onClickViewInvoice={onClickViewInvoice}
      onVoidInvoice={onVoidInvoice}
      refetch={() => getInvoiceList(condominium.id!)}
    />
  );
}
