import React, { useEffect } from "react";

import _ from "lodash";
import moment from "moment";

import { useReduxState, useReduxAction } from "../../../shared-ui/store/hooks";
import { tenantSelector } from "../../../shared-ui/store/selectors/tenant.selector";
import { managerSelector } from "../../../shared-ui/store/selectors/manager.selector";

import ReportWrapper from "../../../components/organisisms/report-wrapper";
import { ColumnProps } from "antd/lib/table/interface";
import { IModule } from "../../../shared-ui/models/module";
import { select } from "../../../shared-ui/store/selectors";
import { currencyFormat, getSum } from "../../../shared-ui/utils/currency";
import { expenseSelector } from "../../../shared-ui/store/selectors/expense.selector";
import { paymentSelector } from "../../../shared-ui/store/selectors/payment.selector";
import { getInvoiceListAction } from "../../../shared-ui/store/actions/invoice.actions";
import { Invoice } from "../../../shared-ui/models/invoice.model";
import { loadPaymentsByQueryAction } from "../../../shared-ui/store/actions/payment.action";
import { Payment } from "../../../shared-ui/models/payment.model";
import { AdvanceQuery } from "../../../shared-ui/models/keylist";
import { PaymentService } from "../../../shared-ui/services/payment.service";
import { createPdf } from "../../../shared-ui/utils/pdf";
import { bankAccountSelector } from "../../../shared-ui/store/selectors/bank-account.selector";
import { refreshBankAccountsAction } from "../../../shared-ui/store/actions/bank-account.actions";
import Select from "../../../components/atoms/select";
import Col from "../../../components/atoms/col";
import { BankAccount } from "../../../shared-ui/models/bank-account";

const managerState = select(managerSelector);
const tenantState = select(tenantSelector);
const paymentState = select(paymentSelector);
const bankAccountState = select(bankAccountSelector);

const service = new PaymentService();

const PaymentReport: React.FC<IModule> = ({ isTenant, id }) => {
  const condominium = useReduxState(managerState("condominium"));
  const apartment = useReduxState(tenantState("apartment"));
  const payments = useReduxState(paymentState("payments"));
  const bankAccounts = useReduxState(bankAccountState("bankAccounts"));

  const loadPayments = useReduxAction(loadPaymentsByQueryAction);
  const loadBankAccounts = useReduxAction(refreshBankAccountsAction());

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
    {
      title: "ID",
      dataIndex: "id",
      width: "80px",
      render: (text: string, payment: Payment) =>
        (payment.id as any) === "Total" ? <strong>{text}</strong> : text
    },
    {
      title: "Método de Pago",
      dataIndex: "methodTypeId",
      width: "180px",
      render: (_: string, payment: Payment) =>
        payment.methodType ? <span>{payment.methodType!.name}</span> : null
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
      render: (_: string, payment: Payment) =>
        payment.status ? <span>{payment.status!.name}</span> : null
    },
    {
      title: "Apartamento",
      dataIndex: "apartmentId",
      width: "180px",
      render: (_: string, payment: Payment) =>
        payment.invoice ? (
          <span>{`${payment.invoice!.apartment!.name} (${
            payment.invoice!.apartment!.building!.name
          })`}</span>
        ) : null
    },
    {
      title: "Monto",
      dataIndex: "amount",
      width: "120px",
      render: (text: number, payment: Payment) =>
        payment.id === ("Total" as any) ? (
          <strong>{formatter(text)}</strong>
        ) : (
          formatter(text)
        )
    },
    {
      title: "Pagado Por",
      dataIndex: "createdBy",
      width: "120px",
      render: (_: string, payment: Payment) =>
        payment.userCreatedBy ? (
          <span>
            {payment.userCreatedBy!.name +
              " " +
              payment.userCreatedBy!.lastName}
          </span>
        ) : null
    },
    {
      title: "Aprobado Por",
      dataIndex: "updatedBy",
      width: "120px",
      render: (_: string, payment: Payment) =>
        payment.approved ? (
          <span>
            {payment.approved
              ? payment.approved!.name + " " + payment.approved!.lastName
              : ""}
          </span>
        ) : null
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

  useEffect(() => {
    if (!condominiumId) return;
    loadBankAccounts({ condominiumId });
  }, [condominiumId]);

  const sumBy = getSum(payments);
  const summary: Payment = {
    id: "Total" as any,
    amount: sumBy("amount")
  };

  return (
    <ReportWrapper
      resetKey={condominiumId}
      data={[...payments, summary]}
      dateKey="createdAt"
      onPrintClicked={print}
      columns={columns}
      refetch={refetch}
    >
      {({ state, setState }) => {
        return (
          <>
            <Col sm={24} md={8}>
              <Select
                name="bankAccountId"
                typeName="id"
                allowClear={true}
                placeholder="Cajas"
                renderNode={(account: BankAccount) => {
                  return `${account.account} [${account.bank!.name}]`;
                }}
                onChange={value => setState({ bankAccountId: value as any })}
                value={state.bankAccountId as number}
                data={bankAccounts}
              />
            </Col>
          </>
        );
      }}
    </ReportWrapper>
  );
};

export default PaymentReport;
