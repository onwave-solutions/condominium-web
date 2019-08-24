import React, { useState, useEffect } from "react";

import { Divider } from "antd";
import moment from "moment";

import { DateRangepicker } from "../../../components/atoms/datepicker";
import { IModule } from "../../../shared-ui/models/module";
import BladeTemplate from "../../../components/templates/blade-template";
import Row from "../../../components/atoms/row";
import Col from "../../../components/atoms/col";
import Button from "../../../components/atoms/button";

import { invoiceSelector } from "../../../shared-ui/store/selectors/invoice.selector";
import { select } from "../../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../../shared-ui/store/hooks";
import { getInvoiceListAction } from "../../../shared-ui/store/actions/invoice.actions";
import { managerSelector } from "../../../shared-ui/store/selectors/manager.selector";
import { getSum, currencyFormat } from "../../../shared-ui/utils/currency";
import { refreshExpensesAction } from "../../../shared-ui/store/actions/expense.actions";
import { expenseSelector } from "../../../shared-ui/store/selectors/expense.selector";
import { PaymentService } from "../../../shared-ui/services/payment.service";
import { createPdf } from "../../../shared-ui/utils/pdf";

const invoiceState = select(invoiceSelector);
const managerState = select(managerSelector);
const expenseState = select(expenseSelector);

const paymentService = new PaymentService();

const FinancialReport: React.FC<IModule> = () => {
  const invoices = useReduxState(invoiceState("invoices"));
  const expenses = useReduxState(expenseState("expenses"));
  const condominium = useReduxState(managerState("condominium"));

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

  const loadInvoices = useReduxAction(getInvoiceListAction());
  const loadExpenses = useReduxAction(refreshExpensesAction());

  const onChange = ([startDate, endDate]: moment.Moment[]) => {
    const start = startDate.startOf("days");

    const end = endDate.endOf("days");

    setStartDate(start);
    setEndDate(end);
    update(start, end);
  };

  const update = (startDate: moment.Moment, endDate: moment.Moment) => {
    loadInvoices(condominium.id!, {
      statusType: "PA",
      createdAt: {
        between: {
          start: startDate.toDate(),
          end: endDate.toDate()
        }
      }
    });
    loadExpenses({
      condominiumId: condominium.id,
      undo: false,
      date: {
        between: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      }
    });
  };

  const print = async () => {
    const tpl = await paymentService.financialReport({
      condominiumId: condominium.id,
      createdAt: {
        between: {
          start: startDate,
          end: endDate
        }
      }
    });
    const pdf = createPdf(tpl);
    pdf.open();
  };

  useEffect(() => {
    if (!condominium.id) return;
    update(startDate, endDate);
  }, [condominium.id]);

  const sumInvoice = getSum(invoices);
  const sumExpense = getSum(expenses);
  const formatter = currencyFormat(condominium);

  const income = sumInvoice("total");
  const expense = sumExpense("amount");

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
        </>
      }
    >
      <Row type="flex" style={{ justifyContent: "flex-end", marginBottom: 5 }}>
        <Col>
          <Button icon="printer" type="primary" onClick={print} />
        </Col>
      </Row>
      <h3>Ingresos</h3>
      <h4>
        Pago Facturas Mantenimiento: <strong>{formatter(0)}</strong>
      </h4>
      <h4>
        Pago Facturas Extraordinarias: <strong>{formatter(income)}</strong>
      </h4>
      <br />

      <h3>Gastos</h3>
      <h4>
        Pago Suplidores: <strong>{formatter(expense)}</strong>
      </h4>
      <Divider />
      <h3>Resultado: {formatter(income - expense)}</h3>
    </BladeTemplate>
  );
};

export default FinancialReport;
