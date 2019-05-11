import React, { useEffect } from "react";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AgGridReact } from "ag-grid-react";

import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import ApartmentForm from "../../components/organisisms/apartment-form";
import BladeTemplate from "../../components/templates/blade-template";

import { select } from "../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { buildingSelector } from "../../shared-ui/store/selectors/building";
import { apartmentSelector } from "../../shared-ui/store/selectors/apartment";
import {
  setApartmentAction,
  createApartmentAction,
  updateApartmentAction,
  refreshApartmentsAction
} from "../../shared-ui/store/actions/apartment";
import { closeChildBladeAction } from "../../shared-ui/store/actions/app";
import { IModule } from "../../shared-ui/models/module";

const columns: ColDef[] = [
  {
    field: "buildingId",
    headerName: "Edificio"
  },
  {
    field: "name",
    headerName: "Nombre"
  },
  {
    field: "floor",
    headerName: "Piso"
  },
  {
    field: "mt2",
    headerName: "Metraje"
  },
  {
    field: "vacancy",
    headerName: "Disponible"
  },
  {
    field: "maintenanceRate",
    headerName: "Costo de Mantenimiento"
  },
  {
    field: "parkingLots",
    headerName: "Parqueos"
  }
];

const buildingState = select(buildingSelector);
const apartmentState = select(apartmentSelector);

export default function Apartment(props: IModule) {
  const building = useReduxState(buildingState("building"));
  const apartment = useReduxState(apartmentState("apartment"));
  const apartments = useReduxState(apartmentState("apartments"));

  const setApartment = useReduxAction(setApartmentAction);

  const create = useReduxAction(createApartmentAction());
  const update = useReduxAction(updateApartmentAction());
  const loadApartment = useReduxAction(refreshApartmentsAction());

  const closeChildBlades = useReduxAction(closeChildBladeAction);

  const clear = () => {
    closeChildBlades(props.id);
    const payload = { buildingId: building.id };
    setApartment(payload);
  };

  useEffect(() => {
    if (apartment.buildingId === building.id) return;
    const payload = { buildingId: building.id };
    setApartment(payload);
    loadApartment(payload);
  }, [building.id]);

  return (
    <BladeTemplate
      footer={
        <>
          {!apartment.id && (
            <Button size={"small"} onClick={() => create(apartment)}>
              Crear
            </Button>
          )}

          {apartment.id && (
            <Button size={"small"} onClick={() => update(apartment)}>
              Guardar
            </Button>
          )}

          <Button size={"small"} style={{ marginLeft: 5 }} onClick={clear}>
            Limpiar
          </Button>
        </>
      }
    >
      <ApartmentForm apartment={apartment} apartmentChange={setApartment} />
      <Col sm={24} md={24}>
        <div
          className="ag-theme-balham"
          style={{
            marginTop: 15,
            height: "180px",
            width: "100%"
          }}
        >
          <AgGridReact
            rowData={apartments}
            columnDefs={columns}
            onRowClicked={event => setApartment(event.data)}
          />
        </div>
      </Col>
    </BladeTemplate>
  );
}
