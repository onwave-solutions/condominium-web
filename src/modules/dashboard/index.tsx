import React, { useEffect } from "react";
import moment from "moment";

import { IModule } from "../../shared-ui/models/module";

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

  return (
    <Scrollbar>
      <BladeTemplate style={{ background: "rgba(255,255,255,0)" }}>
        <Row style={rowStyle} gutter={15} justify="start">
          <Col lg={8} md={12} sm={24} xs={24} style={colStyle}>
            <SalesWidget
              label="Gastos"
              fontColor="#F75D81"
              price={dashboard.aggExpenses}
            />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24} style={colStyle}>
            <SalesWidget
              label="Pendiente a autorizar"
              price={dashboard.aggAuthorizations}
              fontColor="#F75D81"
            />
          </Col>
          <Col lg={8} md={12} sm={24} xs={24} style={colStyle}>
            <SalesWidget
              label="Pagos"
              fontColor="#F75D81"
              price={dashboard.aggPayments}
            />
          </Col>
          <Col lg={6} md={12} sm={24} xs={24} style={colStyle}>
            <StickerWidget
              number={dashboard.openTickets}
              text={"Tickets Abiertos"}
              icon="ion-email-unread"
              fontColor="#ffffff"
              bgColor="#7266BA"
            />
          </Col>
          <Col lg={6} md={12} sm={24} xs={24} style={colStyle}>
            <StickerWidget
              number={dashboard.pendingAuthorizations}
              text={"Autorizaciones"}
              icon="ion-android-cart"
              fontColor="#ffffff"
              bgColor="#F75D81"
            />
          </Col>
          <Col lg={6} md={12} sm={24} xs={24} style={colStyle}>
            <StickerWidget
              number={dashboard.pastDueInvoices}
              text="Facturas en Mora"
              icon="ion-chatbubbles"
              fontColor="#ffffff"
              bgColor="#7ED320"
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
        </Row>
        <Row style={rowStyle} gutter={15} justify="start">
          {(dashboard.newsFee || []).map((newsFee: NewsFee) => (
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
                style={{ height: "350px" }}
              />
            </Col>
          ))}
        </Row>
      </BladeTemplate>
    </Scrollbar>
  );
};

export default DashboardView;
