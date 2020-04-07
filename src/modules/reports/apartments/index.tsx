import React, { useEffect } from "react";

import _ from "lodash";
import moment from "moment";

import { useReduxState, useReduxAction } from "../../../shared-ui/store/hooks";
import { tenantSelector } from "../../../shared-ui/store/selectors/tenant.selector";
import { managerSelector } from "../../../shared-ui/store/selectors/manager.selector";

import ReportWrapper from "../../../components/organisisms/report-wrapper";
import { ColumnProps } from "antd/lib/table/interface";
import { IModule } from "../../../shared-ui/models/module";
import { select } from "../../../shared-ui/store/selectors";
import { currencyFormat, getSum } from "../../../shared-ui/utils/currency";
import { expenseSelector } from "../../../shared-ui/store/selectors/expense.selector";
import { paymentSelector } from "../../../shared-ui/store/selectors/payment.selector";
import { getInvoiceListAction } from "../../../shared-ui/store/actions/invoice.actions";
import { Invoice } from "../../../shared-ui/models/invoice.model";
import { loadPaymentsByQueryAction } from "../../../shared-ui/store/actions/payment.action";
import { Payment } from "../../../shared-ui/models/payment.model";
import { apartmentSelector } from "../../../shared-ui/store/selectors/apartment";
import { refreshApartmentsAction } from "../../../shared-ui/store/actions/apartment";
import { Apartment } from "../../../shared-ui/models/apartment";
import { AdvanceQuery } from "../../../shared-ui/models/keylist";
import { ApartmentService } from "../../../shared-ui/services/apartment";
import { createPdf } from "../../../shared-ui/utils/pdf";
import { buildingSelector } from "../../../shared-ui/store/selectors/building";
import { refreshBuildingsAction } from "../../../shared-ui/store/actions/building";
import Select from "../../../components/atoms/select";
import Col from "../../../components/atoms/col";
import { Building } from "../../../shared-ui/models/building";
import { Service } from "../../../shared-ui/models/service.model";
import { serviceSelector } from "../../../shared-ui/store/selectors/service.selector";
import { loadServicesAction } from "../../../shared-ui/store/actions/service.action";

const serviceState = select(serviceSelector);
const managerState = select(managerSelector);
const tenantState = select(tenantSelector);
const apartmentState = select(apartmentSelector);
const buildingState = select(buildingSelector);

const service = new ApartmentService();

const PaymentReport: React.FC<IModule> = ({ isTenant, id }) => {
  const condominium = useReduxState(managerState("condominium"));
  const apartment = useReduxState(tenantState("apartment"));
  const apartments = useReduxState(apartmentState("apartments"));
  const buildings = useReduxState(buildingState("buildings"));
  const services = useReduxState(serviceState("services"));

  const loadApartments = useReduxAction(refreshApartmentsAction(id));
  const loadBuilding = useReduxAction(refreshBuildingsAction());
  const loadServices = useReduxAction(loadServicesAction(id));

  const condominiumId = isTenant
    ? _.get(apartment, "building.condominium.id")
    : _.get(condominium, "id");

  const targetCondo = isTenant
    ? _.get(apartment, "building.condominium")
    : condominium;

  useEffect(() => {
    if (!condominiumId) return;
    loadBuilding({ condominiumId });
    loadServices({ condominiumId });
  }, [condominiumId]);

  const refetch = (query: AdvanceQuery<Apartment>) => () => {
    loadApartments(
      {
        ...query,
        building: {
          ..._.get(query, "building", {}),
          condominium: {
            id: condominiumId
          },
        }
      },
      { buildingId: "ASC" }
    );
  };

  const print = async (query: AdvanceQuery<Apartment>) => {
    const tpl = await service.report(
      {
        ...query,
        building: {
          ..._.get(query, "building", {}),
          condominium: {
            id: condominiumId
          }
        }
      },
      { buildingId: "ASC" }
    );
    const pdf = createPdf(tpl);
    pdf.open();
  };

  const formatter = currencyFormat(targetCondo);

  const columns: ColumnProps<Apartment>[] = [
    {
      title: "ID",
      dataIndex: "id",
      width: "80px",
      render: (text: string, apartment: Apartment) =>
        (apartment.id as any) === "Total" ? <strong>{text}</strong> : text
    },
    {
      title: "Edificio",
      dataIndex: "buildingId",
      width: "180px",
      render: (_: string, apartment: Apartment) =>
        apartment.building ? <strong>{apartment.building!.name}</strong> : null
    },
    { title: "Identificador", dataIndex: "name", width: "180px" },
    { title: "Piso", dataIndex: "floor", width: "80px" },
    { title: "Área (mts2)", dataIndex: "mt2", width: "80px" },
    { title: "Cantidad de Parqueos", dataIndex: "parkingLots", width: "80px" },
    {
      title: "Plan",
      dataIndex: "serviceId",
      width: "150px",
      render: (_: string, apartment: Apartment) =>
        apartment.service ? (
          <strong>{apartment.service ? apartment.service!.name : "N/A"}</strong>
        ) : null
    },
    {
      title: "Balance",
      dataIndex: "invoiceBalance",
      width: "80px",
      render: (text: number, apartment: Apartment) =>
        apartment.id === ("Total" as any) ? (
          <strong>{formatter(text)}</strong>
        ) : (
          formatter(text)
        )
    }
  ];

  const sumBy = getSum(apartments);
  const summary: Apartment = {
    id: "Total" as any,
    invoiceBalance: sumBy("invoiceBalance")
  };

  return (
    <ReportWrapper
      resetKey={condominiumId}
      data={[...apartments, summary]}
      columns={columns}
      onPrintClicked={print}
      refetch={refetch}
    >
      {({ state, setState }) => {
        return (
          <>
            <Col sm={24} md={8}>
              <Select
                name="buildingId"
                typeName="id"
                allowClear={true}
                placeholder="Edificios"
                renderNode={(building: Building) => {
                  return `${building.name}`;
                }}
                onChange={value => setState({ buildingId: value as any })}
                value={state.buildingId as number}
                data={buildings}
              />
            </Col>
            <Col sm={24} md={8}>
              <Select
                name="serviceId"
                typeName="id"
                allowClear={true}
                placeholder="Planes"
                renderNode={(service: Service) => {
                  return `${service.name}`;
                }}
                onChange={value => setState({ serviceId: value as any })}
                value={state.serviceId as number}
                data={services}
              />
            </Col>
          </>
        );
      }}
    </ReportWrapper>
  );
};

export default PaymentReport;
