import React from "react";
import { ColumnProps } from "antd/lib/table";
import Input from "../../atoms/input";
import Button from "../../atoms/button";
import Table from "./edit-table.style";
import { InvoiceDetail } from "../../../shared-ui/models/invoice.model";
import { stringToPosetiveInt } from "../../../shared-ui/utils/input";

const viewColumns: ColumnProps<InvoiceDetail>[] = [
  {
    title: "#",
    dataIndex: "key",
    width: "10%",
    render: (text: string, singleInvoice: InvoiceDetail) => (
      <span>{singleInvoice.key}</span>
    )
  },
  {
    title: "Descripción",
    dataIndex: "description",
    width: "40%"
  },
  {
    title: "Costo/Unidad",
    dataIndex: "cost",
    width: "15%"
  },
  {
    title: "Cantidad",
    dataIndex: "unit",
    width: "15%"
  },
  {
    title: "Precio",
    dataIndex: "price",
    width: "20%",
    render: (_: string, detail: InvoiceDetail) => (
      <span>{detail.unit! * detail.cost!}</span>
    )
  }
];

export interface IViewTable {
  invoices: InvoiceDetail[];
}

const ViewTable = ({ invoices }: IViewTable) => (
  <Table columns={viewColumns} dataSource={invoices} pagination={false} />
);

ViewTable.defaultProps = {
  invoiceList: []
};

export interface IEditTable {
  invoices: InvoiceDetail[];
  formatter: (amount:number) => string
  invoiceChange: (key: number, name: string, value: any) => void;
  removeInvoice: (key: number) => void;
}

const EditTable = ({ invoices,formatter, invoiceChange, removeInvoice }: IEditTable) => {
  const editColumns: ColumnProps<InvoiceDetail>[] = [
    {
      title: "#",
      dataIndex: "key",
      width: "5%",
      render: (text: string, singleInvoice: InvoiceDetail) => (
        <span>{singleInvoice.key}</span>
      )
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      width: "38%",
      render: (text: string, singleInvoice: InvoiceDetail) => (
        <Input
          placeholder="Descripción"
          value={singleInvoice.description}
          onChange={event => {
            invoiceChange(
              singleInvoice.key!,
              "description",
              event.target.value
            );
          }}
        />
      )
    },
    {
      title: "Costo/Unidad",
      dataIndex: "cost",
      width: "20%",
      render: (text: string, singleInvoice: InvoiceDetail) => (
        <Input
          placeholder="Costo/Unidad"
          type="number"
          value={singleInvoice.cost}
          onChange={event =>
            invoiceChange(
              singleInvoice.key!,
              "cost",
              stringToPosetiveInt(event.target.value)
            )
          }
          //onChange={event => {
          //  editableInvoice.invoiceList[
          //    singleInvoice.key - 1
          //  ].costs = stringToPosetiveInt(
          //    event.target.value,
          //    singleInvoice.costs
          //  );
          //  editInvoice(updateValues(editableInvoice));
          //}}
        />
      )
    },
    {
      title: "Cantidad",
      dataIndex: "unit",
      width: "15%",
      render: (text: string, singleInvoice: InvoiceDetail) => (
        <Input
          placeholder="Cantidad"
          type="number"
          onChange={event =>
            invoiceChange(
              singleInvoice.key!,
              "unit",
              stringToPosetiveInt(event.target.value)
            )
          }
          value={singleInvoice.unit}
        />
      )
    },
    {
      title: "Precio",
      dataIndex: "price",
      width: "12%",
      render: (text:number) => formatter(text)
    },
    {
      title: "",
      dataIndex: "delete",
      width: "10%",
      render: (text: string, singleInvoice: InvoiceDetail) =>
        invoices.length === 1 ? (
          ""
        ) : (
          <Button
            type="danger"

            onClick={() => removeInvoice(singleInvoice.key!)}
          >
            Eliminar
          </Button>
        )
    }
  ];
  return (
    <Table
      size="middle"
      rowKey="key"
      columns={editColumns}
      dataSource={invoices}
      pagination={false}
    />
  );
};

EditTable.defaultProps = {
  invoices: []
};
export { ViewTable, EditTable };
