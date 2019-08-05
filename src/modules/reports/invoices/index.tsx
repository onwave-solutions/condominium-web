import React from "react";

import _ from "lodash";
import moment from "moment";

import { useReduxState, useReduxAction } from "../../../shared-ui/store/hooks";
import { tenantSelector } from "../../../shared-ui/store/selectors/tenant.selector";
import { managerSelector } from "../../../shared-ui/store/selectors/manager.selector";

import ReportWrapper from "../../../components/organisisms/report-wrapper";
import { ColumnProps } from "antd/lib/table/interface";
import { IModule } from "../../../shared-ui/models/module";
import { select } from "../../../shared-ui/store/selectors";
import { currencyFormat } from "../../../shared-ui/utils/currency";
import { expenseSelector } from "../../../shared-ui/store/selectors/expense.selector";
import { invoiceSelector } from "../../../shared-ui/store/selectors/invoice.selector";
import { getInvoiceListAction } from "../../../shared-ui/store/actions/invoice.actions";
import { Invoice } from "../../../shared-ui/models/invoice.model";
import { AdvanceQuery } from "../../../shared-ui/models/keylist";
import { InvoiceService } from "../../../shared-ui/services/invoice.service";
import { createPdf } from "../../../shared-ui/utils/pdf";

const managerState = select(managerSelector);
const tenantState = select(tenantSelector);
const invoiceState = select(invoiceSelector);

const service = new InvoiceService();

const InvoiceReport: React.FC<IModule> = ({ isTenant, id }) => {
  const condominium = useReduxState(managerState("condominium"));
  const apartment = useReduxState(tenantState("apartment"));
  const invoices = useReduxState(invoiceState("invoices"));

  const loadInvoices = useReduxAction(getInvoiceListAction(id));

  const condominiumId = isTenant
    ? _.get(apartment, "building.condominium.id")
    : _.get(condominium, "id");

  const targetCondo = isTenant
    ? _.get(apartment, "building.condominium")
    : condominium;

  const refetch = (query: AdvanceQuery<Invoice>) => () => {
    loadInvoices(
      condominiumId,
      {
        ...query
      },
      { '"Invoice"."created_at"': "ASC" } as any
    );
  };

  const formatter = currencyFormat(targetCondo);

  const columns: ColumnProps<Invoice>[] = [
    { title: "ID", dataIndex: "id", width: "80px" },
    {
      title: "Factura No.",
      dataIndex: "sequence",
      width: "120px"
    },
    {
      title: "Apartamento",
      dataIndex: "apartment",
      width: "120px",
      render: (_: string, invoice: Invoice) => (
        <strong>{`${invoice.apartment!.name} [${
          invoice.apartment!.building!.name
        }]`}</strong>
      )
    },
    {
      title: "Fecha de Creación",
      dataIndex: "createdAt",
      width: "120px"
    },
    {
      title: "Descripción",
      dataIndex: "description",
      width: "150px"
    },
    {
      title: "Fecha de Pago",
      dataIndex: "dueDate",
      width: "120px"
    },
    {
      title: "Estado",
      dataIndex: "dueDate",
      width: "120px",
      render: (_: string, invoice: Invoice) => (
        <strong>{invoice.status!.name}</strong>
      )
    },
    {
      title: "Monto",
      dataIndex: "total",
      width: "150px",
      render: (_: string, invoice: Invoice) => (
        <span>{formatter(invoice.total!)}</span>
      )
    }
  ];

  const print = async (query: AdvanceQuery<Invoice>) => {
    const tpl = await service.reportByCondominiumId(condominiumId, query, {
      '"Invoice"."created_at"': "ASC"
    } as any);
    const pdf = createPdf(tpl);
    pdf.open();
  };

  return (
    <ReportWrapper
      resetKey={condominiumId}
      data={invoices}
      onPrintClicked={print}
      dateKey="createdAt"
      columns={columns}
      refetch={refetch}
    />
  );
};

export default InvoiceReport;
