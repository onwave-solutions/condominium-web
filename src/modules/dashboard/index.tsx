import React, { useEffect } from "react";
import _ from "lodash";
import moment from "moment";

import { IModule } from "../../shared-ui/models/module";

import Table, { Column } from "../../components/atoms/table";
import Row from "../../components/atoms/row";
import Col from "../../components/atoms/col";
import SalesWidget from "../../components/molecules/sales-widget";
import StickerWidget from "../../components/molecules/sticker-widget";
import CardWidget from "../../components/molecules/card-widget";
import BladeTemplate from "../../components/templates/blade-template";
import Scrollbar from "../../components/atoms/scrollbar";
import { select } from "../../shared-ui/store/selectors";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { dashboardSelector } from "../../shared-ui/store/selectors/dashboard.selector";
import { loadDashboardAction } from "../../shared-ui/store/actions/dashboard.action";
import { NewsFee } from "../../shared-ui/models/news-fee.model";
import { Invoice } from "../../shared-ui/models/invoice.model";
import { currencyFormat, getSum } from "../../shared-ui/utils/currency";
import { Ticket } from "../../shared-ui/models/ticket.model";
import { BankAccount } from "../../shared-ui/models/bank-account";

const rowStyle = {
  width: "100%",
  display: "flex",
  flexFlow: "row wrap"
};
const colStyle = {
  marginBottom: "16px"
};

const managerState = select(managerSelector);
const dashboardState = select(dashboardSelector);

const DashboardView: React.FC<IModule> = () => {
  const condominium = useReduxState(managerState("condominium"));
  const dashboard = useReduxState(dashboardState("dashboard"));

  const loadDashboard = useReduxAction(loadDashboardAction);

  useEffect(() => {
    if (!condominium || !condominium.id) return;
    loadDashboard();
  }, [condominium.id]);

  const invoices = _.get<Invoice[]>(dashboard, "invoices", []);
  const tickets = _.get<Ticket[]>(dashboard, "openTickets", []);
  const bankAccounts = _.get<BankAccount[]>(dashboard, "bankAccounts", []);
  const getByState = (filter: string) =>
    invoices.filter(x => x.statusType === filter);

  const formatter = currencyFormat(condominium);

  const invoiceTp = (label: string, list: Invoice[]) => {
    return (
      <Col lg={12} sm={24} xs={24} style={colStyle}>
        <h3>{label}</h3>
        <Table
          dataSource={list}
          size="small"
          style={{ minHeight: 250 }}
          rowKey="sequence"
          pagination={{ pageSize: 5, style: { marginLeft: 5 } }}
          className="invoiceListTable"
        >
          <Column
            title="Factura No."
            dataIndex="sequence"
            width="80px"
            render={(text: string) => <span>{text}</span>}
          />
          <Column
            title={"Apartamento"}
            dataIndex={"apartment"}
            width={"120px"}
            render={(_: string, invoice: Invoice) => {
              return (
                <strong>{`${invoice.apartment!.name} [${
                  invoice.apartment!.building!.name
                }]`}</strong>
              );
            }}
          />
          <Column
            title={"Descripción"}
            dataIndex={"description"}
            width={"170px"}
            render={(text: string) => <span>{text}</span>}
          />
          <Column
            title={"Estado"}
            dataIndex={"dueDate"}
            width={"15%"}
            render={(_: string, invoice: Invoice) => (
              <strong>{invoice.status!.name}</strong>
            )}
          />

          <Column
            title={"Total"}
            dataIndex={"total"}
            width={"20%"}
            render={(text: number) => (
              <strong>{formatter ? formatter(text) : text}</strong>
            )}
          />
        </Table>
      </Col>
    );
  };

  return (
    <Scrollbar>
      <BladeTemplate style={{ background: "rgba(255,255,255,0)" }}>
        <Row style={rowStyle} gutter={15} justify="start">
          <Col lg={8} md={12} sm={24} xs={24} style={colStyle}>
            <SalesWidget
              label="Gastos"
              fontColor="#F75D81"
              price={formatter(dashboard.aggExpenses)}
            />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24} style={colStyle}>
            <SalesWidget
              label="Pendiente a autorizar"
              price={formatter(dashboard.aggAuthorizations)}
              fontColor="#F75D81"
            />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24} style={colStyle}>
            <SalesWidget
              label="Pagos"
              fontColor="#F75D81"
              price={formatter(dashboard.aggPayments)}
            />
          </Col>

          <Col lg={6} md={12} sm={24} xs={24} style={colStyle} />
          <Col lg={6} md={12} sm={24} xs={24} style={colStyle}>
            <StickerWidget
              number={tickets.length}
              text={"Tickets Abiertos"}
              icon="ion-email-unread"
              fontColor="#ffffff"
              bgColor="#7266BA"
            />
          </Col>
          <Col lg={6} md={12} sm={24} xs={24} style={colStyle}>
            <StickerWidget
              number={dashboard.activeNewsFee}
              text="Noticias Activas"
              icon="ion-chatbubbles"
              fontColor="#ffffff"
              bgColor="#42A5F6"
            />
          </Col>
          <Col lg={6} md={12} sm={24} xs={24} style={colStyle} />
        </Row>

        <Row style={rowStyle} gutter={15} justify="start">
          {invoiceTp("Facturas en Mora", getByState("MO"))}
          {invoiceTp("Facturas Pendientes", getByState("PE"))}
          {invoiceTp("Autorizaciones", getByState("PP"))}
          <Col lg={12} sm={24} xs={24} style={colStyle}>
            <h3>Tickets Abiertos</h3>
            <Table
              dataSource={tickets}
              size="small"
              rowKey="id"
              style={{ minHeight: 250 }}
              pagination={{ pageSize: 5, style: { marginLeft: 5 } }}
              className="invoiceListTable"
            >
              <Column
                title="Título"
                dataIndex="title"
                width="80px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Creado en"
                dataIndex="createdAt"
                width="80px"
                render={(text: string) => (
                  <span>{moment(text).format("DD/MM/YYYY")}</span>
                )}
              />
              <Column
                title="Descripción"
                dataIndex="description"
                width="80px"
              />
            </Table>
          </Col>
          <Col lg={12} sm={24} xs={24} style={colStyle}>
            <h3>Cajas</h3>
            <Table
              dataSource={bankAccounts}
              size="small"
              style={{ minHeight: 250 }}
              rowKey="id"
              pagination={{ pageSize: 5, style: { marginLeft: 5 } }}
              className="invoiceListTable"
            >
              <Column
                title="Caja"
                dataIndex="bankName"
                width="80px"
                render={(_: string, bankAcc: BankAccount) => (
                  <span>{bankAcc.bank!.name}</span>
                )}
              />
              <Column
                title="Número de Referencia"
                dataIndex="account"
                width="80px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Balance"
                dataIndex="balance"
                width="80px"
                render={(text: number) => <span>{formatter(text)}</span>}
              />
              <Column
                title="Descripción"
                dataIndex="description"
                width="80px"
                render={(text: string) => <span>{text}</span>}
              />
            </Table>
          </Col>
        </Row>
        <Row style={rowStyle} gutter={15} justify="start">
          {(dashboard.newsFee || []).slice(0, 5).map((newsFee: NewsFee) => (
            <Col
              lg={8}
              md={12}
              sm={24}
              xs={24}
              style={colStyle}
              key={newsFee.id}
            >
              <CardWidget
                title={newsFee.title}
                subTitle={`${moment(newsFee.createdAt).format(
                  "DD/MMM/YYYY"
                )} - ${moment(newsFee.endDate).format("DD/MMM/YYYY")}`}
                description={newsFee.description}
                style={{ height: "250px" }}
              />
            </Col>
          ))}
        </Row>
      </BladeTemplate>
    </Scrollbar>
  );
};

export default DashboardView;
