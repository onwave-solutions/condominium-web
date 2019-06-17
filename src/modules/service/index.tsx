import React, { useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import { IModule } from "../../shared-ui/models/module";
import BladeTemplate from "../../components/templates/blade-template";
import ServiceForm from "../../components/organisisms/service-form";
import { select } from "../../shared-ui/store/selectors";
import { serviceSelector } from "../../shared-ui/store/selectors/service.selector";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import {
  setServiceAction,
  loadServicesAction,
  createServiceAction,
  updateServiceAction
} from "../../shared-ui/store/actions/service.action";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { closeChildBladeAction } from "../../shared-ui/store/actions/app";

const serviceState = select(serviceSelector);
const managerState = select(managerSelector);

export default function Service(props: IModule) {
  const service = useReduxState(serviceState("service"));
  const services = useReduxState(serviceState("services"));
  const condominium = useReduxState(managerState("condominium"));

  const setService = useReduxAction(setServiceAction);
  const loadServices = useReduxAction(loadServicesAction(props.id));
  const create = useReduxAction(createServiceAction(props.id));
  const update = useReduxAction(updateServiceAction(props.id));
  const clear = () => setService({});
  const closeChildBlades = useReduxAction(closeChildBladeAction);

  useEffect(() => {
    if (condominium.id === service.condominiumId) return;
    const payload = { condominiumId: condominium.id };
    setService(payload);
    loadServices(payload);
    closeChildBlades(props.id);
  }, [condominium.id]);

  return (
    <BladeTemplate
      header={
        <>
          {!service.id && (
            <Button type="primary" onClick={() => create(service)}>
              Crear
            </Button>
          )}
          {service.id && (
            <Button type="primary" onClick={() => update(service)}>
              Guardar
            </Button>
          )}
          <Button onClick={clear} style={{ marginLeft: 5 }}>
            Limpiar
          </Button>
        </>
      }
    >
      <ServiceForm service={service} serviceChanged={setService} />
      <Col sm={24} md={24}>
        <div
          className="ag-theme-balham"
          style={{
            marginTop: 15,
            height: "220px",
            width: "100%"
          }}
        >
          <AgGridReact
            rowData={services}
            columnDefs={columns}
            onRowClicked={event => setService(event.data)}
          />
        </div>
      </Col>
    </BladeTemplate>
  );
}

const columns: ColDef[] = [
  {
    field: "name",
    headerName: "Nombre"
  },
  {
    field: "description",
    headerName: "Descripción"
  },
  {
    field: "cutoffDay",
    headerName: "Día de corte"
  },
  {
    field: "dueDay",
    headerName: "Día de pago"
  },
  {
    field: "amount",
    headerName: "Monto"
  }
];
