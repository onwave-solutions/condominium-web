import React, { useEffect, useState } from "react";
import BladeTemplate from "../../templates/blade-template";
import ScrollbarWrapper from "../../atoms/scrollbar";
import Table, { Column } from "../../atoms/table";
import Button from "../../atoms/button";
import { Wrapper, StatusTag } from "./style";
import { Invoice } from "../../../shared-ui/models/invoice.model";
import ColumnInputFilter from "../../molecules/column-input-filter";
import ColumnSelectFilter from "../../molecules/column-select-filter";
import { Keylist } from "../../../shared-ui/models/keylist";

export interface IInvoiceListView {
  refetch(): void;
  hideInvoiceEditor?: boolean;
  onAddInvoice?(): void;
  invoices: Invoice[];
  onClickPayInvoice?: (invoice: Invoice) => () => void;
  keylist: Keylist;
  onClickViewInvoice?: (invoice: Invoice) => () => void;
  onClickEditInvoice?: (invoice: Invoice) => () => void;
  onVoidInvoice?: (invoice: Invoice) => () => void;
}

export default function InvoiceListView({
  refetch,
  invoices,
  keylist,
  onClickPayInvoice,
  hideInvoiceEditor,
  onClickEditInvoice,
  onClickViewInvoice,
  onVoidInvoice,
  onAddInvoice
}: IInvoiceListView) {
  const [searchText, setSearchText] = useState("");

  const onFilter = (fn: (record: any) => any) => (value: any, record: any) =>
    fn(record)
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase());

  const handleSearch = (selectedKeys: string[], confirm: Function) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters: Function) => {
    clearFilters();
    setSearchText("");
  };

  return (
    <BladeTemplate
      header={
        <>
          <Button
            icon="sync"
            onClick={refetch}
            //onClick={() => getInvoiceList(condominium.id!)}
          />
          <div style={{ flex: 1 }} />
          {!hideInvoiceEditor && (
            <Button onClick={onAddInvoice}>Agregar Factura</Button>
          )}
        </>
      }
    >
      <Wrapper>
        <div className="isoInvoiceTable">
          <ScrollbarWrapper style={{ width: "100%" }}>
            <Table
              //rowSelection={rowSelection}
              dataSource={invoices}
              rowKey="sequence"
              scroll={{ x: 1400 }}
              pagination={false}
              className="invoiceListTable"
            >
              <Column
                title="Factura No."
                fixed={"left"}
                dataIndex="sequence"
                onFilter={onFilter(record => record.sequence)}
                filterDropdown={(filterProps: any) => (
                  <ColumnInputFilter
                    {...filterProps}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                width="80px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title={"Apartamento"}
                dataIndex={"apartment"}
                width={"22%"}
                filterDropdown={(filterProps: any) => (
                  <ColumnInputFilter
                    {...filterProps}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                onFilter={onFilter(
                  record =>
                    record.apartment.name + record.apartment.building.name
                )}
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
                filterDropdown={(filterProps: any) => (
                  <ColumnInputFilter
                    {...filterProps}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                onFilter={onFilter(record => record.description || "")}
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
                filterDropdown={(filterProps: any) => (
                  <ColumnSelectFilter
                    {...filterProps}
                    data={keylist.invoiceStatus}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                onFilter={onFilter(record => record.statusType || "")}
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
                      onClick={onClickViewInvoice!(invoice)}
                      className="invoiceDltBtn"
                      ghost={true}
                      size="default"
                      icon="eye"
                    />
                    {["PA", "AN"].includes(invoice.statusType!) ||
                    hideInvoiceEditor ? null : (
                      <Button
                        shape="circle"
                        className="invoiceDltBtn"
                        type="primary"
                        onClick={
                          onClickEditInvoice && onClickEditInvoice!(invoice)
                        }
                        size="default"
                        icon="edit"
                      />
                    )}
                    {["AN", "PA"].includes(invoice.statusType!) ||
                    hideInvoiceEditor ? null : (
                      <Button
                        className="invoiceDltBtn"
                        shape="circle"
                        onClick={onVoidInvoice && onVoidInvoice!(invoice)}
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
                    <Button
                      size="small"
                      onClick={onClickPayInvoice && onClickPayInvoice!(invoice)}
                    >
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
