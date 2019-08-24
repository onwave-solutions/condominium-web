import React, { useEffect, useState } from "react";

import moment from "moment";

import { DateRangepicker } from "../../components/atoms/datepicker";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { IModule } from "../../shared-ui/models/module";
import Button, { ButtonGroup } from "../../components/atoms/button";
import BladeTemplate from "../../components/templates/blade-template";
import { Wrapper } from "../../components/atoms/body-wrapper";
import Table, { Column } from "../../components/atoms/table";
import Dropdown from "../../components/atoms/dropdown";
import PopConfirm from "../../components/atoms/pop-confirm";
import Icon from "../../components/atoms/icon";
import Menu from "../../components/atoms/menu";
import ScrollbarWrapper from "../../components/atoms/scrollbar";
import { Payment } from "../../shared-ui/models/payment.model";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { select } from "../../shared-ui/store/selectors";
import {
  loadPaymentsByQueryAction,
  updateExpenseAction
} from "../../shared-ui/store/actions/payment.action";
import { paymentSelector } from "../../shared-ui/store/selectors/payment.selector";
import { AdvanceQuery } from "../../shared-ui/models/keylist";
import { currencyFormat, getSum } from "../../shared-ui/utils/currency";
import { PaymentService } from "../../shared-ui/services/payment.service";
import { createPdf } from "../../shared-ui/utils/pdf";
import ColumnInputFilter from "../../components/molecules/column-input-filter";
import ColumnSelectFilter from "../../components/molecules/column-select-filter";
import { appSelector } from "../../shared-ui/store/selectors/app";
import { refreshBankAccountsAction } from "../../shared-ui/store/actions/bank-account.actions";
import { bankAccountSelector } from "../../shared-ui/store/selectors/bank-account.selector";

const bankAccountState = select(bankAccountSelector);
const managerState = select(managerSelector);
const paymentState = select(paymentSelector);
const appState = select(appSelector);

const service = new PaymentService();

const PaymentList: React.FC<IModule> = props => {
  const keylist = useReduxState(appState("keylist"));
  const condominium = useReduxState(managerState("condominium"));
  const payments = useReduxState(paymentState("payments"));
  const bankAccounts = useReduxState(bankAccountState("bankAccounts"));
  const [searchText, setSearchText] = useState("");

  const loadPayments = useReduxAction(loadPaymentsByQueryAction);
  const loadBankAccounts = useReduxAction(refreshBankAccountsAction());
  const undoPayment = useReduxAction(updateExpenseAction);
  const formatter = currencyFormat(condominium);

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

  const payload: AdvanceQuery<Payment>[] = ["AP", "AN"].map<
    AdvanceQuery<Payment>
  >(status => ({
    condominiumId: condominium.id,
    bankAccount: {
      isNull: false
    },
    statusTypeId: status,
    createdAt: {
      between: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    }
  }));

  const onChange = ([startDate, endDate]: moment.Moment[]) => {
    const start = startDate.startOf("days");

    const end = endDate.endOf("days");

    setStartDate(start);
    setEndDate(end);
    const payload: AdvanceQuery<Payment>[] = ["AP", "AN"].map<
      AdvanceQuery<Payment>
    >(status => ({
      condominiumId: condominium.id,
      bankAccount: {
        isNull: false
      },
      statusTypeId: status,
      createdAt: {
        between: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      }
    }));
    loadPayments(payload);
  };

  useEffect(() => {
    if (!condominium.id) return;
    loadPayments(payload);
  }, [condominium.id]);

  const openPDF = ({ id }: Payment) => async () => {
    const tpl = await service.pdfById(id!);
    const pdf = createPdf(tpl);
    pdf.open();
  };

  const onFilter = (fn: (record: any) => any) => (value: any, record: any) =>
    fn(record)
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase());

  const handleReset = (clearFilters: Function) => {
    clearFilters();
    setSearchText("");
  };

  const handleSearch = (selectedKeys: string[], confirm: Function) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const sumBy = getSum(payments);

  return (
    <>
      <BladeTemplate
        header={
          <>
            <DateRangepicker
              format="DD/MMM/YYYY"
              onChange={onChange as any}
              value={[startDate, endDate]}
            />
            <div style={{ flex: 1 }} />
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
                  width="80px"
                  render={(text: string) => <span>{text}</span>}
                />
                <Column
                  title="Método de Pago"
                  dataIndex="methodTypeId"
                  width="100px"
                  filterDropdown={(filterProps: any) => (
                    <ColumnSelectFilter
                      {...filterProps}
                      data={keylist.paymentMethods}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
                  onFilter={onFilter(record => record.methodTypeId || "")}
                  render={(_: string, payment: Payment) => (
                    <span>{payment.methodType!.name}</span>
                  )}
                />
                <Column
                  title="Caja"
                  dataIndex="bankAccountId"
                  width="180px"
                  onFilter={onFilter(
                    record =>
                      record.bankAccount.bank.name +
                      "-" +
                      record.bankAccount.account
                  )}
                  filterDropdown={(filterProps: any) => (
                    <ColumnInputFilter
                      {...filterProps}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
                  render={(_: string, payment: Payment) =>
                    payment.bankAccountId ? (
                      <span>
                        {payment.bankAccount!.bank!.name}-
                        {payment.bankAccount!.account}
                      </span>
                    ) : null
                  }
                />
                <Column
                  title="Estado"
                  dataIndex="statusTypeId"
                  width="100px"
                  filterDropdown={(filterProps: any) => (
                    <ColumnSelectFilter
                      {...filterProps}
                      data={keylist.paymentStatus}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
                  onFilter={onFilter(record => record.statusTypeId || "")}
                  render={(_: string, payment: Payment) => (
                    <span>{payment.status!.name}</span>
                  )}
                />
                <Column
                  title="Apartamento"
                  dataIndex="apartmentId"
                  width="100px"
                  onFilter={onFilter(record => record.invoice.apartment.name)}
                  filterDropdown={(filterProps: any) => (
                    <ColumnInputFilter
                      {...filterProps}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
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
                  render={(text: number) => <strong>{formatter(text)}</strong>}
                />
                <Column
                  title="Pagado Por"
                  dataIndex="createdBy"
                  width="80px"
                  onFilter={onFilter(
                    record =>
                      record.userCreatedBy!.name +
                      " " +
                      record.userCreatedBy!.lastName
                  )}
                  filterDropdown={(filterProps: any) => (
                    <ColumnInputFilter
                      {...filterProps}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
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
                  onFilter={onFilter(record =>
                    record.approved
                      ? record.approved!.name + " " + record.approved!.lastName
                      : ""
                  )}
                  filterDropdown={(filterProps: any) => (
                    <ColumnInputFilter
                      {...filterProps}
                      handleSearch={handleSearch}
                      handleReset={handleReset}
                    />
                  )}
                  render={(_: string, payment: Payment) =>
                    payment.approved ? (
                      <span>
                        {payment.approved!.name +
                          " " +
                          payment.approved!.lastName}
                      </span>
                    ) : null
                  }
                />
                <Column
                  title={"Fecha de Pago"}
                  dataIndex={"createdAt"}
                  width={"120px"}
                  render={(text: string) => <strong>{text}</strong>}
                />
                <Column
                  title={"Fecha de Autorización"}
                  dataIndex={"approvedAt"}
                  width={"120px"}
                  render={(text: string) => <strong>{text}</strong>}
                />
                <Column
                  title="Accciones"
                  dataIndex="view"
                  width="100px"
                  render={(_: string, payment: Payment) => {
                    const menu = (
                      <Menu>
                        {(payment.attachments || []).map(file => (
                          <Menu.Item key={file.id}>
                            <a href={file.url}>{file.description}</a>
                          </Menu.Item>
                        ))}
                      </Menu>
                    );

                    return (
                      <ButtonGroup className="isoInvoiceBtnView">
                        {(payment.attachments || []).length > 0 && (
                          <Button type="primary">
                            <Dropdown overlay={menu} trigger={["click"]}>
                              <a href="#">
                                <Icon type="file" style={{ color: "white" }} />
                              </a>
                            </Dropdown>
                          </Button>
                        )}

                        <Button
                          onClick={() =>
                            props.history.push(
                              `/invoice-view/${payment.invoiceId}`
                            )
                          }
                          size="default"
                          type="primary"
                          icon="eye"
                        />
                        <Button
                          onClick={openPDF(payment)}
                          type="primary"
                          size="default"
                          icon="printer"
                        />
                        {payment.statusTypeId === "AP" && (
                          <PopConfirm
                            title="Esta seguro de anular este gasto?"
                            onConfirm={() =>
                              undoPayment({ ...payment, statusTypeId: "AN" })
                            }
                          >
                            <Button
                              type="danger"
                              size="default"
                              icon="delete"
                            />
                          </PopConfirm>
                        )}
                      </ButtonGroup>
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
};

export default PaymentList;
