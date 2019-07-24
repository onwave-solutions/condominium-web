import React, { useEffect } from "react";

import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { IModule } from "../../shared-ui/models/module";
import Button from "../../components/atoms/button";
import BladeTemplate from "../../components/templates/blade-template";
import { Wrapper } from "../../components/atoms/body-wrapper";
import Table, { Column } from "../../components/atoms/table";
import ScrollbarWrapper from "../../components/atoms/scrollbar";
import { Payment } from "../../shared-ui/models/payment.model";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { select } from "../../shared-ui/store/selectors";
import { loadPaymentsByQueryAction } from "../../shared-ui/store/actions/payment.action";
import { paymentSelector } from "../../shared-ui/store/selectors/payment.selector";
import { AdvanceQuery } from "../../shared-ui/models/keylist";
import { currencyFormat } from "../../shared-ui/utils/currency";

const managerState = select(managerSelector);
const paymentState = select(paymentSelector);

const PaymentList: React.FC<IModule> = props => {
  const condominium = useReduxState(managerState("condominium"));
  const payments = useReduxState(paymentState("payments"));

  const payload: AdvanceQuery<Payment> = {
    condominiumId: condominium.id,
    bankAccount: {
      isNull: false
    },
    statusTypeId: "AP"
  };

  const loadPayments = useReduxAction(loadPaymentsByQueryAction);
  const formatter = currencyFormat(condominium);

  useEffect(() => {
    if (!payload.condominiumId) return;
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
                  title="Caja"
                  dataIndex="bankAccountId"
                  width="180px"
                  render={(_: string, payment: Payment) => (
                    <span>
                      {payment.bankAccount!.bank!.name}-
                      {payment.bankAccount!.account}
                    </span>
                  )}
                />
                <Column
                  title="Estado"
                  dataIndex="statusTypeId"
                  width="100px"
                  render={(_: string, payment: Payment) => (
                    <span>{payment.status!.name}</span>
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
                  title="Pagado Por"
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
                  title="Aprobado Por"
                  dataIndex="updatedBy"
                  width="80px"
                  render={(_: string, payment: Payment) => (
                    <span>
                      {payment.userUpdatedBy!.name +
                        " " +
                        payment.userUpdatedBy!.lastName}
                    </span>
                  )}
                />
                <Column
                  title={"Fecha de Pago"}
                  dataIndex={"createdAt"}
                  width={"120px"}
                  render={(text: string) => <strong>{text}</strong>}
                />
                <Column
                  title={"Fecha de Autorización"}
                  dataIndex={"updatedAt"}
                  width={"120px"}
                  render={(text: string) => <strong>{text}</strong>}
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
              </Table>
            </ScrollbarWrapper>
          </div>
        </Wrapper>
      </BladeTemplate>
    </>
  );
};

export default PaymentList;
