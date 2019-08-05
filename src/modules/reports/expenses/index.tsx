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
import { currencyFormat } from "../../../shared-ui/utils/currency";
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

const managerState = select(managerSelector);
const tenantState = select(tenantSelector);
const expenseState = select(expenseSelector);
const bankAccountState = select(bankAccountSelector);

const service = new ExpenseService();

const ExpenseReport: React.FC<IModule> = ({ isTenant, id }) => {
  const condominium = useReduxState(managerState("condominium"));
  const apartment = useReduxState(tenantState("apartment"));
  const expenses = useReduxState(expenseState("expenses"));
  const bankAccounts = useReduxState(bankAccountState("bankAccounts"));

  const loadExpenses = useReduxAction(refreshExpensesAction(id));
  const loadBankAccounts = useReduxAction(refreshBankAccountsAction());

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
    { title: "ID", dataIndex: "id", width: "80px" },
    {
      title: "Suplidor",
      dataIndex: "supplier",
      width: "120px",
      render: (_: string, expense: Expense) => (
        <span>{expense.supplier!.description}</span>
      )
    },
    {
      title: "Monto",
      dataIndex: "amount",
      width: "150px",
      render: (_: string, expense: Expense) => (
        <span>{formatter(expense.amount!)}</span>
      )
    },
    {
      title: "Caja",
      dataIndex: "bankAccountId",
      width: "180px",
      render: (_: string, expense: Expense) => (
        <span>{`${expense.bankAccount!.bank!.name} - ${
          expense.bankAccount!.account
        }`}</span>
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
      render: (_: string, expense: Expense) => (
        <span>
          {(expense.userCreatedBy!.name || "") +
            " " +
            (expense.userCreatedBy!.lastName || "")}
        </span>
      )
    }
  ];

  useEffect(() => {
    if (!condominiumId) return;
    loadBankAccounts({ condominiumId });
  }, [condominiumId]);

  return (
    <ReportWrapper
      resetKey={condominiumId}
      data={expenses}
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

export default ExpenseReport;
