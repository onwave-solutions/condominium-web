import React, { useEffect } from "react";

import _ from "lodash";
import moment from "moment";

import { useReduxState, useReduxAction } from "../../../shared-ui/store/hooks";
import { tenantSelector } from "../../../shared-ui/store/selectors/tenant.selector";
import { managerSelector } from "../../../shared-ui/store/selectors/manager.selector";

import ReportWrapper from "../../../components/organisisms/report-wrapper";
import { Expense } from "../../../shared-ui/models/expense.model";
import { ColumnProps } from "antd/lib/table/interface";
import { IModule } from "../../../shared-ui/models/module";
import { select } from "../../../shared-ui/store/selectors";
import { currencyFormat, getSum } from "../../../shared-ui/utils/currency";
import { expenseSelector } from "../../../shared-ui/store/selectors/expense.selector";
import { refreshExpensesAction } from "../../../shared-ui/store/actions/expense.actions";
import { AdvanceQuery } from "../../../shared-ui/models/keylist";
import Select from "../../../components/atoms/select";
import Col from "../../../components/atoms/col";
import { bankAccountSelector } from "../../../shared-ui/store/selectors/bank-account.selector";
import { refreshBankAccountsAction } from "../../../shared-ui/store/actions/bank-account.actions";
import { BankAccount } from "../../../shared-ui/models/bank-account";
import { ExpenseService } from "../../../shared-ui/services/expense.service";
import { createPdf } from "../../../shared-ui/utils/pdf";
import { Supplier } from "../../../shared-ui/models/supplier.model";
import { supplierSelector } from "../../../shared-ui/store/selectors/supplier.selector";
import { loadSuppliersAction } from "../../../shared-ui/store/actions/supplier.action";

const managerState = select(managerSelector);
const tenantState = select(tenantSelector);
const expenseState = select(expenseSelector);
const supplierState = select(supplierSelector);
const bankAccountState = select(bankAccountSelector);

const service = new ExpenseService();

const ExpenseReport: React.FC<IModule> = ({ isTenant, id }) => {
  const condominium = useReduxState(managerState("condominium"));
  const apartment = useReduxState(tenantState("apartment"));
  const expenses = useReduxState(expenseState("expenses"));
  const bankAccounts = useReduxState(bankAccountState("bankAccounts"));
  const suppliers = useReduxState(supplierState("suppliers"));

  const loadExpenses = useReduxAction(refreshExpensesAction(id));
  const loadBankAccounts = useReduxAction(refreshBankAccountsAction());
  const loadSupplierList = useReduxAction(loadSuppliersAction(id));

  const condominiumId = isTenant
    ? _.get(apartment, "building.condominium.id")
    : _.get(condominium, "id");

  const targetCondo = isTenant
    ? _.get(apartment, "building.condominium")
    : condominium;

  const refetch = (query: AdvanceQuery<Expense>) => () => {
    loadExpenses(
      {
        condominiumId,
        ...query
      },
      { date: "ASC" }
    );
  };

  const print = async (query: AdvanceQuery<Expense>) => {
    const tpl = await service.report(query, { date: "ASC" });
    const pdf = createPdf(tpl);
    pdf.open();
  };

  const formatter = currencyFormat(targetCondo);

  const columns: ColumnProps<Expense>[] = [
    {
      title: "ID",
      dataIndex: "id",
      width: "80px",
      render: (text: string, expense: Expense) =>
        (expense.id as any) === "Total" ? <strong>{text}</strong> : text
    },
    {
      title: "Suplidor",
      dataIndex: "supplier",
      width: "120px",
      render: (text: string, expense: Expense) => (
        <span>{_.get(expense, ["supplier", "description"], "")}</span>
      )
    },
    {
      title: "Monto",
      dataIndex: "amount",
      width: "150px",
      render: (text: string, expense: Expense) =>
        (expense.id as any) === "Total" ? (
          <strong>{formatter(_.get(expense, "amount", 0))}</strong>
        ) : (
          <span>{formatter(_.get(expense, "amount", 0))}</span>
        )
    },
    {
      title: "Caja",
      dataIndex: "bankAccountId",
      width: "180px",
      render: (text: string, expense: Expense) => (
        <span>{`${_.get(
          expense,
          ["bankAccount", "bank", "name"],
          ""
        )} - ${_.get(expense, ["bankAccount", "account"], "")}`}</span>
      )
    },
    {
      title: "Descripción",
      dataIndex: "description",
      width: "150px"
    },
    {
      title: "Fecha Efectiva",
      dataIndex: "date",
      width: "100px"
    },
    {
      title: "Creado Por",
      dataIndex: "createdBy",
      width: "120px",
      render: (text: string, expense: Expense) => (
        <span>
          {_.get(expense, ["userCreatedBy", "name"], "") +
            " " +
            _.get(expense, ["userCreatedBy", "lastName"], "")}
        </span>
      )
    }
  ];

  useEffect(() => {
    if (!condominiumId) return;
    loadBankAccounts({ condominiumId });
    loadSupplierList({ condominiumId });
  }, [condominiumId]);

  const sumBy = getSum(expenses);
  const summary: Expense = {
    id: "Total" as any,
    amount: sumBy("amount")
  };

  return (
    <ReportWrapper
      resetKey={condominiumId}
      data={[...expenses, summary]}
      dateKey="date"
      columns={columns}
      onPrintClicked={print}
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
            <Col sm={24} md={8}>
              <Select
                name="supplierId"
                typeName="id"
                allowClear={true}
                placeholder="Suplidor"
                renderNode={(supplier: Supplier) => {
                  return `${supplier.description} [${supplier.document}]`;
                }}
                onChange={value => setState({ supplierId: value as any })}
                value={state.supplierId as number}
                data={suppliers}
              />
            </Col>
          </>
        );
      }}
    </ReportWrapper>
  );
};

export default ExpenseReport;
