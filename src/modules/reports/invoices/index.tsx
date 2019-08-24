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
import { invoiceSelector } from "../../../shared-ui/store/selectors/invoice.selector";
import { getInvoiceListAction } from "../../../shared-ui/store/actions/invoice.actions";
import { Invoice } from "../../../shared-ui/models/invoice.model";
import { AdvanceQuery } from "../../../shared-ui/models/keylist";
import { InvoiceService } from "../../../shared-ui/services/invoice.service";
import { createPdf } from "../../../shared-ui/utils/pdf";
import Select from "../../../components/atoms/select";
import Input from "../../../components/atoms/input";
import Col from "../../../components/atoms/col";
import { buildingSelector } from "../../../shared-ui/store/selectors/building";
import { refreshBuildingsAction } from "../../../shared-ui/store/actions/building";
import { Building } from "../../../shared-ui/models/building";
import { apartmentSelector } from "../../../shared-ui/store/selectors/apartment";
import { refreshApartmentsAction } from "../../../shared-ui/store/actions/apartment";

const managerState = select(managerSelector);
const tenantState = select(tenantSelector);
const invoiceState = select(invoiceSelector);
const buildingState = select(buildingSelector);
const apartmentState = select(apartmentSelector);

const service = new InvoiceService();

const InvoiceReport: React.FC<IModule> = ({ isTenant, id }) => {
  const condominium = useReduxState(managerState("condominium"));
  const apartment = useReduxState(tenantState("apartment"));
  const invoices = useReduxState(invoiceState("invoices"));
  const buildings = useReduxState(buildingState("buildings"));
  const apartments = useReduxState(apartmentState("apartments"));

  const loadInvoices = useReduxAction(getInvoiceListAction(id));
  const loadBuilding = useReduxAction(refreshBuildingsAction());
  const loadApartment = useReduxAction(refreshApartmentsAction());

  const condominiumId = isTenant
    ? _.get(apartment, "building.condominium.id")
    : _.get(condominium, "id");

  const targetCondo = isTenant
    ? _.get(apartment, "building.condominium")
    : condominium;

  const refetch = (query: AdvanceQuery<Invoice>) => () => {
    loadInvoices(condominiumId, {
      ...query
    });
  };

  const formatter = currencyFormat(targetCondo);

  const columns: ColumnProps<Invoice>[] = [
    {
      title: "ID",
      dataIndex: "id",
      width: "80px",
      render: (text: string, invoice: Invoice) =>
        (invoice.id as any) === "Total" ? <strong>{text}</strong> : text
    },
    {
      title: "Factura No.",
      dataIndex: "sequence",
      width: "120px"
    },
    {
      title: "Apartamento",
      dataIndex: "apartment",
      width: "120px",
      render: (_: string, invoice: Invoice) =>
        invoice.apartment ? (
          <strong>{`${invoice.apartment!.name} [${
            invoice.apartment!.building!.name
          }]`}</strong>
        ) : (
          undefined
        )
    },
    {
      title: "Fecha de Creación",
      dataIndex: "createdAt",
      width: "120px"
    },
    {
      title: "Descripción",
      dataIndex: "description",
      width: "150px"
    },
    {
      title: "Fecha de Pago",
      dataIndex: "dueDate",
      width: "120px"
    },
    {
      title: "Estado",
      dataIndex: "dueDate",
      width: "120px",
      render: (_: string, invoice: Invoice) =>
        invoice.status ? <strong>{invoice.status!.name}</strong> : undefined
    },
    {
      title: "Monto",
      dataIndex: "total",
      width: "150px",
      render: (_: string, invoice: Invoice) =>
        invoice.id === ("Total" as any) ? (
          <strong>{formatter(invoice.total!)}</strong>
        ) : (
          <span>{formatter(invoice.total!)}</span>
        )
    }
  ];

  useEffect(() => {
    if (!condominiumId) return;
    loadBuilding({ condominiumId });
  }, [condominiumId]);

  const print = async (query: AdvanceQuery<Invoice>) => {
    const tpl = await service.reportByCondominiumId(condominiumId, query, {
      '"Invoice"."created_at"': "ASC"
    } as any);
    const pdf = createPdf(tpl);
    pdf.open();
  };

  const sumBy = getSum(invoices);
  const summary: Invoice = {
    id: "Total" as any,
    total: sumBy("total")
  };

  return (
    <ReportWrapper
      resetKey={condominiumId}
      data={[...invoices, summary]}
      onPrintClicked={print}
      dateKey="createdAt"
      columns={columns}
      refetch={refetch}
    >
      {({ state, setState }) => {
        return (
          <>
            <Col sm={24} md={8}>
              <Input
                name="buildingId"
                placeholder="Factura No."
                onChange={({ target: { value } }) =>
                  setState({
                    sequence: value
                      ? {
                          startWith: value
                        }
                      : undefined
                  })
                }
                value={_.get(state, ["sequence", "startWith"])}
              />
            </Col>

            <Col sm={24} md={8}>
              <Select
                name="buildingId"
                typeName="id"
                allowClear={true}
                placeholder="Edificios"
                renderNode={(building: Building) => {
                  return `${building.name}`;
                }}
                onChange={value =>
                  setState({
                    apartment: {
                      ..._.get(value, "apartment", {}),
                      buildingId: value as any
                    }
                  })
                }
                value={_.get(state, ["apartment", "buildingId"])}
                data={buildings}
              />
            </Col>
          </>
        );
      }}
    </ReportWrapper>
  );
};

export default InvoiceReport;
