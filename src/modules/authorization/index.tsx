import React, { useState, useEffect } from "react";

import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { IModule } from "../../shared-ui/models/module";
import BladeTemplate from "../../components/templates/blade-template";
import { Wrapper } from "../../components/atoms/body-wrapper";
import Table, { Column } from "../../components/atoms/table";
import Button, { ButtonGroup } from "../../components/atoms/button";
import ScrollbarWrapper from "../../components/atoms/scrollbar";
import { Payment } from "../../shared-ui/models/payment.model";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { select } from "../../shared-ui/store/selectors";
import {
  loadPaymentsByQueryAction,
  rejectPaymentAction,
  acceptPaymentAction
} from "../../shared-ui/store/actions/payment.action";
import { paymentSelector } from "../../shared-ui/store/selectors/payment.selector";
import { AdvanceQuery } from "../../shared-ui/models/keylist";
import { bankAccountSelector } from "../../shared-ui/store/selectors/bank-account.selector";

import BankAccountSelector from "../../components/organisisms/bank-account-selector-form";
import { refreshBankAccountsAction } from "../../shared-ui/store/actions/bank-account.actions";
import { currencyFormat } from "../../shared-ui/utils/currency";

const managerState = select(managerSelector);
const paymentState = select(paymentSelector);
const bankAccountState = select(bankAccountSelector);

const AuthorizationView: React.FC<IModule> = props => {
  const [visible, setVisible] = useState<number | undefined>();
  const condominium = useReduxState(managerState("condominium"));
  const payments = useReduxState(paymentState("payments"));
  const bankAccounts = useReduxState(bankAccountState("bankAccounts"));

  const payload: AdvanceQuery<Payment> = {
    condominiumId: condominium.id,
    statusTypeId: "PA",
    bankAccountId: {
      isNull: true
    }
  };

  const formatter = currencyFormat(condominium);

  const loadPayments = useReduxAction(loadPaymentsByQueryAction);
  const loadBankAccounts = useReduxAction(refreshBankAccountsAction());
  const reject = useReduxAction(rejectPaymentAction(payload));
  const accept = useReduxAction(acceptPaymentAction(payload));

  const handleVisibility = (visible: number) => () => setVisible(visible);

  const onAuthorize = (payment: Payment) => (accountId: number) => {
    accept({ ...payment, bankAccountId: accountId });
  };

  const onReject = (payment: Payment) => () => {
    reject(payment.id!);
  };

  useEffect(() => {
    loadBankAccounts({ condominiumId: condominium.id });
    loadPayments(payload);
  }, [condominium.id]);

  return (
    <>
      <BladeTemplate
        header={
          <>
            <div />
          </>
        }
      >
        <Wrapper>
          <div className="isoInvoiceTable">
            <ScrollbarWrapper style={{ width: "100%" }}>
              <Table
                dataSource={payments}
                rowKey="id"
                pagination={{ pageSize: 5, showSizeChanger: true }}
                className="invoiceListTable"
              >
                <Column
                  title="ID"
                  dataIndex="id"
                  width="80px"
                  render={(text: string) => <span>{text}</span>}
                />
                <Column
                  title="Método de Pago"
                  dataIndex="methodTypeId"
                  width="100px"
                  render={(_: string, payment: Payment) => (
                    <span>{payment.methodType!.name}</span>
                  )}
                />
                <Column
                  title="Apartamento"
                  dataIndex="apartmentId"
                  width="100px"
                  render={(_: string, payment: Payment) => (
                    <span>{`${payment.invoice!.apartment!.name} (${
                      payment.invoice!.apartment!.building!.name
                    })`}</span>
                  )}
                />
                <Column
                  title="Monto"
                  dataIndex="amount"
                  width="80px"
                  render={(text: number) => formatter(text)}
                />
                <Column
                  title="Creado Por"
                  dataIndex="createdBy"
                  width="80px"
                  render={(_: string, payment: Payment) => (
                    <span>
                      {payment.userCreatedBy!.name +
                        " " +
                        payment.userCreatedBy!.lastName}
                    </span>
                  )}
                />
                <Column
                  title="Ver Factura"
                  dataIndex="view"
                  width="100px"
                  render={(_: string, payment: Payment) => (
                    <div className="isoInvoiceBtnView">
                      <Button
                        shape="circle"
                        onClick={() =>
                          props.history.push(
                            `/invoice-view/${payment.invoiceId}`
                          )
                        }
                        className="invoiceDltBtn"
                        ghost={true}
                        size="default"
                        icon="eye"
                      />
                    </div>
                  )}
                />
                <Column
                  title="Acciones"
                  dataIndex="actions"
                  width="100px"
                  render={(_: string, payment: Payment) => (
                    <>
                      <ButtonGroup className="isoInvoiceBtnView">
                        <Button
                          type="primary"
                          onClick={handleVisibility(payment.id!)}
                          className="invoiceDltBtn"
                          icon="check"
                          size="default"
                        />
                        <Button
                          type="danger"
                          onClick={onReject(payment)}
                          className="invoiceDltBtn"
                          icon="close"
                          size="default"
                        />
                      </ButtonGroup>
                      <BankAccountSelector
                        accounts={bankAccounts}
                        formatter={formatter}
                        visible={visible === payment.id}
                        onAction={onAuthorize(payment)}
                        onClose={handleVisibility(0)}
                      />
                    </>
                  )}
                />
              </Table>
            </ScrollbarWrapper>
          </div>
        </Wrapper>
      </BladeTemplate>
    </>
  );
};

export default AuthorizationView;
