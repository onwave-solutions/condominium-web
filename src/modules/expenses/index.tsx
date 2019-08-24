import React, { useState, useEffect } from "react";

import moment from "moment";

import { IModule } from "../../shared-ui/models/module";
import { select } from "../../shared-ui/store/selectors";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import BladeTemplate from "../../components/templates/blade-template";
import Button, { ButtonGroup } from "../../components/atoms/button";
import PopConfirm from "../../components/atoms/pop-confirm";
import Dropdown from "../../components/atoms/dropdown";
import Icon from "../../components/atoms/icon";
import Menu from "../../components/atoms/menu";
import { Wrapper } from "../../components/atoms/body-wrapper";
import Table, { Column } from "../../components/atoms/table";
import ScrollbarWrapper from "../../components/atoms/scrollbar";
import ColumnInputFilter from "../../components/molecules/column-input-filter";
//import ColumnSelectFilter from "../../components/molecules/column-select-filter";

import { expenseSelector } from "../../shared-ui/store/selectors/expense.selector";
import {
  refreshExpensesAction,
  createExpenseAction,
  undoExpenseAction
} from "../../shared-ui/store/actions/expense.actions";
import ExpenseCreateForm from "../../components/organisisms/expense-create-form";
import { supplierSelector } from "../../shared-ui/store/selectors/supplier.selector";
import { loadSuppliersAction } from "../../shared-ui/store/actions/supplier.action";
import { Expense } from "../../shared-ui/models/expense.model";
import { bankAccountSelector } from "../../shared-ui/store/selectors/bank-account.selector";
import { refreshBankAccountsAction } from "../../shared-ui/store/actions/bank-account.actions";
import { currencyFormat, getSum } from "../../shared-ui/utils/currency";
import { formatWithOptions } from "util";

const managerState = select(managerSelector);
const expenseState = select(expenseSelector);
const supplierState = select(supplierSelector);
const bankAccountState = select(bankAccountSelector);

export default function ExpenseModule(props: IModule) {
  const [visible, setVisibility] = useState(false);
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

  const condominium = useReduxState(managerState("condominium"));
  const expenses = useReduxState(expenseState("expenses"));
  const suppliers = useReduxState(supplierState("suppliers"));

  const bankAccounts = useReduxState(bankAccountState("bankAccounts"));

  const formatter = currencyFormat(condominium);

  const payload = {
    condominiumId: condominium.id
  };

  const loadBankAccounts = useReduxAction(refreshBankAccountsAction());
  const loadExpenses = useReduxAction(refreshExpensesAction(props.id));
  const loadSupplierList = useReduxAction(loadSuppliersAction(props.id));
  const createExpense = useReduxAction(createExpenseAction(props.id));
  const undoExpense = useReduxAction(undoExpenseAction);

  const handleLoadSuppliers = () =>
    loadSupplierList({ condominiumId: condominium.id, disabled: false });

  useEffect(() => {
    loadExpenses(payload);
    loadBankAccounts(payload);
    handleLoadSuppliers();
  }, [condominium.id]);

  const handleCreateExpense = async (expense: Expense) => {
    await createExpense(
      {
        ...expense,
        amount: parseFloat(`${expense.amount}`),
        condominiumId: condominium.id
      },
      () => {
        setVisibility(false);
        loadBankAccounts(payload);
      }
    );
  };

  const sumBy = getSum(expenses);

  return (
    <>
      <ExpenseCreateForm
        visible={visible}
        suppliers={suppliers}
        accounts={bankAccounts}
        onAction={handleCreateExpense}
        onClose={() => setVisibility(false)}
      />
      <BladeTemplate
        header={
          <>
            <Button type="primary" onClick={() => setVisibility(true)}>
              Agregar Gasto{" "}
            </Button>
          </>
        }
      >
        <Wrapper>
          <div className="isoInvoiceTable">
            <ScrollbarWrapper style={{ width: "100%" }}>
              <Table
                dataSource={expenses}
                rowKey="id"
                pagination={{ pageSize: 5, showSizeChanger: true }}
                className="invoiceListTable"
                footer={() => {
                  return (
                    <>
                      <h3>Total: {formatter!(sumBy("amount"))}</h3>
                    </>
                  );
                }}
              >
                <Column
                  title="ID"
                  dataIndex="id"
                  onFilter={onFilter(record => record.id)}
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
                  title="Suplidor"
                  dataIndex="supplier.description"
                  onFilter={onFilter(record => record.supplier.description)}
                  filterDropdown={(filterProps: any) => (
                    <ColumnInputFilter
                      {...filterProps}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
                  width="100px"
                  render={(_: string, expense: Expense) => (
                    <span>{expense.supplier!.description}</span>
                  )}
                />
                <Column
                  title="Monto"
                  dataIndex="amount"
                  onFilter={onFilter(record => record.amount)}
                  filterDropdown={(filterProps: any) => (
                    <ColumnInputFilter
                      {...filterProps}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
                  width="80px"
                  render={(_: string, expense: Expense) => (
                    <strong>
                      {!expense.undo ? formatter(expense.amount!) : "ANULADA"}
                    </strong>
                  )}
                />
                <Column
                  title="Caja"
                  dataIndex="bankAccountId"
                  width="180px"
                  render={(_: string, expense: Expense) => (
                    <span>{`${expense.bankAccount!.bank!.name} - ${
                      expense.bankAccount!.account
                    }`}</span>
                  )}
                />
                <Column
                  title="Descripción"
                  dataIndex="description"
                  onFilter={onFilter(record => record.description)}
                  filterDropdown={(filterProps: any) => (
                    <ColumnInputFilter
                      {...filterProps}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
                  width="80px"
                  render={(_: string, expense: Expense) => (
                    <span>{expense.description}</span>
                  )}
                />
                <Column title="Fecha Efectiva" dataIndex="date" width="80px" />
                <Column
                  title="Creado Por"
                  dataIndex="createdBy"
                  onFilter={onFilter(
                    record =>
                      record.userCreatedBy.name +
                      " " +
                      record.userCreatedBy.lastName
                  )}
                  filterDropdown={(filterProps: any) => (
                    <ColumnInputFilter
                      {...filterProps}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
                  width="80px"
                  render={(_: string, expense: Expense) => (
                    <span>
                      {(expense.userCreatedBy!.name || "") +
                        " " +
                        (expense.userCreatedBy!.lastName || "")}
                    </span>
                  )}
                />
                <Column
                  title="Acciones"
                  dataIndex="actions"
                  width="80px"
                  render={(_: string, expense: Expense) => {
                    const menu = (
                      <Menu>
                        {(expense.attachments || []).map(file => (
                          <Menu.Item key={file.id}>
                            <a href={file.url}>{file.description}</a>
                          </Menu.Item>
                        ))}
                      </Menu>
                    );
                    return (
                      <>
                        <ButtonGroup>
                          {(expense.attachments || []).length > 0 && (
                            <Button type="primary">
                              <Dropdown overlay={menu} trigger={["click"]}>
                                <a href="#">
                                  <Icon
                                    type="file"
                                    style={{ color: "white" }}
                                  />
                                </a>
                              </Dropdown>
                            </Button>
                          )}
                          {!expense.undo && (
                            <PopConfirm
                              title="Esta seguro de anular este gasto?"
                              onConfirm={() => {
                                undoExpense(expense, () => {
                                  loadBankAccounts(payload);
                                });
                              }}
                            >
                              <Button
                                type="danger"
                                size="default"
                                icon="close"
                              />
                            </PopConfirm>
                          )}
                        </ButtonGroup>
                      </>
                    );
                  }}
                />
              </Table>
            </ScrollbarWrapper>
          </div>
        </Wrapper>
      </BladeTemplate>
    </>
  );
}
