import React, { useEffect, useState } from "react";

import _ from "lodash";
import moment from "moment";

import { IModule } from "../../shared-ui/models/module";

import { DateRangepicker } from "../../components/atoms/datepicker";
import BladeTemplate from "../../components/templates/blade-template";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import ScrollbarWrapper from "../../components/atoms/scrollbar";
import Table, { Column } from "../../components/atoms/table";
import Button from "../../components/atoms/button";
import FormItem from "../../components/molecules/form-item";
import Select from "../../components/atoms/select";

import {
  Wrapper,
  StatusTag
} from "../../components/organisisms/invoice-list-view/style";
import { Invoice } from "../../shared-ui/models/invoice.model";
import ColumnInputFilter from "../../components/molecules/column-input-filter";
import ColumnSelectFilter from "../../components/molecules/column-select-filter";

import { select } from "../../shared-ui/store/selectors";
import { transactionSelector } from "../../shared-ui/store/selectors/transaction.selector";
import { loadTransactionsByQueryAction } from "../../shared-ui/store/actions/transaction.action";
import { Transaction } from "../../shared-ui/models/transaction.model";
import { BankAccount } from "../../shared-ui/models/bank-account";
import { bankAccountSelector } from "../../shared-ui/store/selectors/bank-account.selector";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { refreshBankAccountsAction } from "../../shared-ui/store/actions/bank-account.actions";
import { currencyFormat } from "../../shared-ui/utils/currency";

const transactionState = select(transactionSelector);
const bankAccountState = select(bankAccountSelector);
const managerState = select(managerSelector);

export default function TransactionView(props: IModule) {
  const { match } = props;
  const [bankAccountId, setBankAccountId] = useState<number | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState<moment.Moment>(
    moment()
      .startOf("month")
      .startOf("hours")
      .startOf("minutes")
      .startOf("seconds")
  );

  const [endDate, setEndDate] = useState<moment.Moment>(
    moment()
      .endOf("month")
      .endOf("hours")
      .endOf("minutes")
      .endOf("seconds")
  );

  const transactions = useReduxState(transactionState("transactions"));
  const loadTransactions = useReduxAction(loadTransactionsByQueryAction);
  const condominium = useReduxState(managerState("condominium"));
  const bankAccounts = useReduxState(bankAccountState("bankAccounts"));

  const loadBankAccounts = useReduxAction(refreshBankAccountsAction());

  useEffect(() => {
    if (!condominium.id) return;
    const payload = { condominiumId: condominium.id };
    loadBankAccounts(payload);
  }, [condominium.id]);

  useEffect(() => {
    if (!bankAccounts || !bankAccounts.length) {
      setBankAccountId(undefined);
      return;
    }
    setBankAccountId(bankAccounts[0].id);
  }, [bankAccounts.length]);

  const refetch = (
    start: moment.Moment = startDate,
    end: moment.Moment = endDate
  ) => {
    loadTransactions({
      accountId: bankAccountId,
      createdAt: {
        between: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      }
    });
  };

  useEffect(() => {
    refetch();
  }, [bankAccountId]);

  const onItemSelect = (_: string, value: any) => {
    setBankAccountId(value);
  };

  const formatter = currencyFormat(condominium);

  const onChange = ([startDate, endDate]: moment.Moment[]) => {
    const start = startDate
      .startOf("month")
      .startOf("hours")
      .startOf("minutes")
      .startOf("seconds");

    const end = endDate
      .endOf("month")
      .endOf("hours")
      .endOf("minutes")
      .endOf("seconds");

    setStartDate(start);
    setEndDate(end);
    refetch(start, end);
  };

  return (
    <BladeTemplate
      header={
        <>
          <DateRangepicker
            format="DD/MMM/YYYY"
            onChange={onChange as any}
            value={[startDate, endDate]}
          />
          <div style={{ flex: 1 }} />
          <Button icon="sync" onClick={() => refetch()} />
        </>
      }
    >
      <Wrapper>
        <FormItem label="Seleccione una caja" md={12} sm={24}>
          <Select
            name="bankAccountId"
            style={{ marginBottom: "1rem" }}
            typeName="id"
            renderNode={(account: BankAccount) => {
              return `${account.account} [${account.bank!.name}] (${formatter(
                account.balance!
              )})`;
            }}
            onChangeItem={onItemSelect}
            value={bankAccountId}
            data={bankAccounts}
          />
        </FormItem>
        <div className="isoInvoiceTable">
          <ScrollbarWrapper style={{ width: "100%" }}>
            <Table
              //rowSelection={rowSelection}
              dataSource={bankAccountId ? transactions : []}
              rowKey="transactionId"
              pagination={{ pageSize: 5, showSizeChanger: true }}
              className="invoiceListTable"
            >
              <Column
                title="ID Transacción"
                dataIndex="id"
                width="100px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Caja"
                dataIndex="accountId"
                width="100px"
                render={(_: string, transaction: Transaction) => (
                  <span>{`${transaction.account!.bank!.name} (${
                    transaction.account!.account
                  })`}</span>
                )}
              />
              <Column
                title="Descripción"
                dataIndex="description"
                width="180px"
                render={(__: string, transaction: Transaction) => (
                  <span>
                    {transaction.paymentId
                      ? _.get(transaction, "payment.invoice.description")
                      : transaction.expenseId
                      ? _.get(transaction, "expense.supplier.description") +
                        ": " +
                        _.get(transaction, "expense.description")
                      : ""}
                  </span>
                )}
              />
              <Column
                title="Crédito"
                dataIndex="income"
                width="100px"
                render={(text: number) => <span>{formatter(text)}</span>}
              />
              <Column
                title="Débito"
                dataIndex="outcome"
                width="100px"
                render={(text: number) => <span>{formatter(text)}</span>}
              />
              <Column
                title="Balance"
                dataIndex="balance"
                width="100px"
                render={(text: number) => <span>{formatter(text)}</span>}
              />
              <Column
                title="Fecha Efectiva"
                dataIndex="createdAt"
                width="100px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Ver Detalle"
                dataIndex="detail"
                width="5%"
                render={(text: string) => <span>{text}</span>}
              />
            </Table>
          </ScrollbarWrapper>
        </div>
      </Wrapper>
    </BladeTemplate>
  );
}
