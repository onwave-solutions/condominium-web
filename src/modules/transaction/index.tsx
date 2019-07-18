import React, { useEffect } from "react";

import { IModule } from "../../shared-ui/models/module";

import { DateRangepicker } from "../../components/atoms/datepicker";
import BladeTemplate from "../../components/templates/blade-template";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import ScrollbarWrapper from "../../components/atoms/scrollbar";
import Table, { Column } from "../../components/atoms/table";
import Button from "../../components/atoms/button";
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

const transactionState = select(transactionSelector);

export default function TransactionView(props: IModule) {
  const { match } = props;
  const transactions = useReduxState(transactionState("transactions"));
  const loadTransactions = useReduxAction(loadTransactionsByQueryAction);

  useEffect(() => {
    if (match && match.params && match.params.id) {
      const id = match.params.id;
      loadTransactions({
        accountId: id
      });
    }
  }, []);

  return (
    <BladeTemplate
      header={
        <>
          <Button icon="sync" />
          <DateRangepicker format="DD/MMM/YYYY" />
        </>
      }
    >
      <Wrapper>
        <div className="isoInvoiceTable">
          <ScrollbarWrapper style={{ width: "100%" }}>
            <Table
              //rowSelection={rowSelection}
              dataSource={transactions}
              rowKey="transactionId"
              pagination={{ pageSize: 5, showSizeChanger: true }}
              className="invoiceListTable"
            >
              <Column
                title="ID Transacción"
                dataIndex="transactionId"
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
                title="Crédito"
                dataIndex="income"
                width="100px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Débito"
                dataIndex="outcome"
                width="100px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Balance"
                dataIndex="balance"
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
