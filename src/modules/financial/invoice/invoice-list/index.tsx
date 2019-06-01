import React, { useEffect } from "react";
import styled from "styled-components";

import Scrollbars from "../../../../components/atoms/scrollbar";
import BladeTemplate from "../../../../components/templates/blade-template";
import Table, { Column } from "../../../../components/atoms/table";
import Button from "../../../../components/atoms/button";
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

const ScrollbarWrapper = styled(Scrollbars)``;

const invoiceState = select(invoiceSelector);
const managerState = select(managerSelector);

export default function InvoiceModule(props: IModule) {
  const condominium = useReduxState(managerState("condominium"));
  const invoices = useReduxState(invoiceState("invoices"));

  const getInvoiceList = useReduxAction(getInvoiceListAction(props.id));
  const setInvoice = useReduxAction(setInvoiceAction);
  const handleAddBlade = useReduxAction(addChildBlade(props.id));
  const handleCloseBlade = useReduxAction(closeBlade);
  const onResetInvoice = useReduxAction(resetInvoiceAction);
  const updateInvoice = useReduxAction(updateInvoiceServiceAction(props.id));

  const onVoidInvoice = (invoice: Invoice) => () => {
    updateInvoice(condominium.id!, {
      ...invoice,
      statusType: "AN"
    });
  };

  const onClickViewInvoice = (invoice: Invoice) => () => {
    handleAddBlade(invoiceViewModule.id);
    handleCloseBlade(invoiceEditorModule.id);
    setInvoice({ ...invoice });
  };

  const onClickEditInvoice = (invoice: Invoice) => () => {
    handleAddBlade(invoiceEditorModule.id);
    handleCloseBlade(invoiceViewModule.id);
    setInvoice({ ...invoice });
  };

  const onClickPayInvoice = (invoice: Invoice) => () => {
    handleAddBlade(paymentBladeModule.id);
  };

  const onAddInvoice = () => {
    handleAddBlade(invoiceEditorModule.id);
    handleCloseBlade(invoiceViewModule.id);
    onResetInvoice();
  };

  useEffect(() => {
    getInvoiceList(condominium.id!);
  }, [condominium.id]);

  return (
    <BladeTemplate
      header={
        <>
          <Button
            icon="sync"
            size="small"
            onClick={() => getInvoiceList(condominium.id!)}
          />
          <div style={{ flex: 1 }} />
          <Button size={"small"} onClick={onAddInvoice}>
            Agregar Factura
          </Button>
        </>
      }
    >
      <Wrapper>
        <div className="isoInvoiceTable">
          <ScrollbarWrapper style={{ width: "100%" }}>
            <Table
              //rowSelection={rowSelection}
              dataSource={invoices}
              size="small"
              rowKey="sequence"
              scroll={{ x: 1400 }}
              pagination={false}
              className="invoiceListTable"
            >
              <Column
                title="Factura No."
                fixed={"left"}
                dataIndex="sequence"
                width="80px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title={"Apartamento"}
                dataIndex={"apartment"}
                width={"22%"}
                render={(_: string, invoice: Invoice) => {
                  return (
                    <strong>{`${invoice.apartment!.name} [${
                      invoice.apartment!.building!.name
                    }]`}</strong>
                  );
                }}
              />
              <Column
                title={"Descripción"}
                dataIndex={"description"}
                width={"25%"}
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title={"Fecha de Pago"}
                dataIndex={"dueDate"}
                width={"15%"}
                render={(text: string) => <strong>{text}</strong>}
              />
              <Column
                title={"Estado"}
                dataIndex={"statusType"}
                width={"18%"}
                render={(text: string, invoice: Invoice) => {
                  let className;
                  if (text === "PA") {
                    className = "delivered";
                  } else if (text === "MO") {
                    className = "shipped";
                  } else if (text === "AN") {
                    className = "pending";
                  }
                  return (
                    <StatusTag className={className}>
                      {invoice.status!.name}
                    </StatusTag>
                  );
                }}
              />
              <Column
                title={"Total"}
                dataIndex={"total"}
                width={"20%"}
                render={(text: string) => <strong>RD$ {text}</strong>}
              />
              <Column
                title={"Acciones"}
                dataIndex={"view"}
                width={"5%"}
                render={(_: string, invoice: Invoice) => (
                  <div className="isoInvoiceBtnView">
                    <Button
                      shape="circle"
                      onClick={onClickViewInvoice(invoice)}
                      className="invoiceDltBtn"
                      ghost={true}
                      size="default"
                      icon="eye"
                    />
                    {["PA", "AN"].includes(invoice.statusType!) ? null : (
                      <Button
                        shape="circle"
                        className="invoiceDltBtn"
                        type="primary"
                        onClick={onClickEditInvoice(invoice)}
                        size="default"
                        icon="edit"
                      />
                    )}
                    {["AN", "PA"].includes(invoice.statusType!) ? null : (
                      <Button
                        className="invoiceDltBtn"
                        shape="circle"
                        onClick={onVoidInvoice(invoice)}
                        type="danger"
                        size="default"
                        icon="delete"
                      />
                    )}
                  </div>
                )}
              />
              <Column
                title="Pagos"
                dataIndex={"payment"}
                width={"5%"}
                render={(_: string, invoice: Invoice) =>
                  ["PE", "MO"].includes(invoice.statusType!) ? (
                    <Button size="small" onClick={onClickPayInvoice(invoice)}>
                      Pagar
                    </Button>
                  ) : (
                    <span />
                  )
                }
              />
            </Table>
          </ScrollbarWrapper>
        </div>
      </Wrapper>
    </BladeTemplate>
  );
}
