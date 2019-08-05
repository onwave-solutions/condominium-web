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
import { paymentSelector } from "../../../shared-ui/store/selectors/payment.selector";
import { getInvoiceListAction } from "../../../shared-ui/store/actions/invoice.actions";
import { Invoice } from "../../../shared-ui/models/invoice.model";
import { loadPaymentsByQueryAction } from "../../../shared-ui/store/actions/payment.action";
import { Payment } from "../../../shared-ui/models/payment.model";
import { AdvanceQuery } from "../../../shared-ui/models/keylist";
import { PaymentService } from "../../../shared-ui/services/payment.service";
import { createPdf } from "../../../shared-ui/utils/pdf";

const managerState = select(managerSelector);
const tenantState = select(tenantSelector);
const paymentState = select(paymentSelector);

const service = new PaymentService();

const PaymentReport: React.FC<IModule> = ({ isTenant, id }) => {
  const condominium = useReduxState(managerState("condominium"));
  const apartment = useReduxState(tenantState("apartment"));
  const payments = useReduxState(paymentState("payments"));

  const loadPayments = useReduxAction(loadPaymentsByQueryAction);

  const condominiumId = isTenant
    ? _.get(apartment, "building.condominium.id")
    : _.get(condominium, "id");

  const targetCondo = isTenant
    ? _.get(apartment, "building.condominium")
    : condominium;

  const refetch = (query: AdvanceQuery<Payment>) => () => {
    loadPayments(
      {
        condominiumId,
        ...query
      },
      { createdAt: "ASC" } as any
    );
  };

  const formatter = currencyFormat(targetCondo);

  const print = async (query: AdvanceQuery<Payment>) => {
    const tpl = await service.report(query, { createdAt: "ASC" });
    const pdf = createPdf(tpl);
    pdf.open();
  };

  const columns: ColumnProps<Payment>[] = [
    { title: "ID", dataIndex: "id", width: "80px" },
    {
      title: "Método de Pago",
      dataIndex: "methodTypeId",
      width: "180px",
      render: (_: string, payment: Payment) => (
        <span>{payment.methodType!.name}</span>
      )
    },
    {
      title: "Caja",
      dataIndex: "bankAccountId",
      width: "180px",
      render: (_: string, payment: Payment) =>
        payment.bankAccount ? (
          <span>
            {payment.bankAccount!.bank!.name}-{payment.bankAccount!.account}
          </span>
        ) : null
    },
    {
      title: "Estado",
      dataIndex: "statusTypeId",
      width: "120px",
      render: (_: string, payment: Payment) => (
        <span>{payment.status!.name}</span>
      )
    },
    {
      title: "Apartamento",
      dataIndex: "apartmentId",
      width: "180px",
      render: (_: string, payment: Payment) => (
        <span>{`${payment.invoice!.apartment!.name} (${
          payment.invoice!.apartment!.building!.name
        })`}</span>
      )
    },
    {
      title: "Monto",
      dataIndex: "amount",
      width: "120px",
      render: (text: number) => formatter(text)
    },
    {
      title: "Pagado Por",
      dataIndex: "createdBy",
      width: "120px",
      render: (_: string, payment: Payment) => (
        <span>
          {payment.userCreatedBy!.name + " " + payment.userCreatedBy!.lastName}
        </span>
      )
    },
    {
      title: "Aprobado Por",
      dataIndex: "updatedBy",
      width: "120px",
      render: (_: string, payment: Payment) => (
        <span>
          {payment.approved
            ? payment.approved!.name + " " + payment.approved!.lastName
            : ""}
        </span>
      )
    },
    {
      title: "Fecha de Pago",
      dataIndex: "createdAt",
      width: "120px",
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: "Fecha de Autorización",
      dataIndex: "approvedAt",
      width: "120px",
      render: (text: string) => <strong>{text}</strong>
    }
  ];

  return (
    <ReportWrapper
      resetKey={condominiumId}
      data={payments}
      dateKey="createdAt"
      onPrintClicked={print}
      columns={columns}
      refetch={refetch}
    />
  );
};

export default PaymentReport;
