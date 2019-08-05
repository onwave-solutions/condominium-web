import React from "react";

import _ from "lodash";
import moment from "moment";

import { useReduxState, useReduxAction } from "../../../shared-ui/store/hooks";
import { tenantSelector } from "../../../shared-ui/store/selectors/tenant.selector";
import { managerSelector } from "../../../shared-ui/store/selectors/manager.selector";

import ReportWrapper from "../../../components/organisisms/report-wrapper";
import { ColumnProps } from "antd/lib/table/interface";
import { IModule } from "../../../shared-ui/models/module";
import { select } from "../../../shared-ui/store/selectors";
import { currencyFormat } from "../../../shared-ui/utils/currency";
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

const managerState = select(managerSelector);
const tenantState = select(tenantSelector);
const apartmentState = select(apartmentSelector);

const service = new ApartmentService();

const PaymentReport: React.FC<IModule> = ({ isTenant, id }) => {
  const condominium = useReduxState(managerState("condominium"));
  const apartment = useReduxState(tenantState("apartment"));
  const apartments = useReduxState(apartmentState("apartments"));

  const loadApartments = useReduxAction(refreshApartmentsAction(id));

  const condominiumId = isTenant
    ? _.get(apartment, "building.condominium.id")
    : _.get(condominium, "id");

  const targetCondo = isTenant
    ? _.get(apartment, "building.condominium")
    : condominium;

  const refetch = (query: AdvanceQuery<Apartment>) => () => {
    loadApartments(
      {
        building: {
          condominium: {
            id: condominiumId
          }
        }
      },
      { buildingId: "ASC" }
    );
  };

  const print = async (query: AdvanceQuery<Apartment>) => {
    const tpl = await service.report(
      {
        building: {
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
    { title: "ID", dataIndex: "id", width: "80px" },
    {
      title: "Edificio",
      dataIndex: "buildingId",
      width: "180px",
      render: (_: string, apartment: Apartment) => (
        <strong>{apartment.building!.name}</strong>
      )
    },
    { title: "Identificador", dataIndex: "name", width: "180px" },
    { title: "Piso", dataIndex: "floor", width: "80px" },
    { title: "Área (mts2)", dataIndex: "mt2", width: "80px" },
    { title: "Cantidad de Parqueos", dataIndex: "parkingLots", width: "80px" },
    {
      title: "Plan",
      dataIndex: "serviceId",
      width: "150px",
      render: (_: string, apartment: Apartment) => (
        <strong>{apartment.service ? apartment.service!.name : "N/A"}</strong>
      )
    },
    {
      title: "Balance a favor",
      dataIndex: "balance",
      width: "80px",
      render: (text: number) => formatter(text)
    }
  ];

  return (
    <ReportWrapper
      resetKey={condominiumId}
      data={apartments}
      columns={columns}
      onPrintClicked={print}
      refetch={refetch}
    />
  );
};

export default PaymentReport;
