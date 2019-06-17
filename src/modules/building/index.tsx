import React, { useEffect } from "react";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AgGridReact } from "ag-grid-react";

import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import BuildingForm from "../../components/organisisms/building-form";
import BladeTemplate from "../../components/templates/blade-template";
import apartmentModule from "../apartment/module";

import { select } from "../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { buildingSelector } from "../../shared-ui/store/selectors/building";
import {
  setBuildingAction,
  createBuildingAction,
  updateBuildingAction,
  refreshBuildingsAction
} from "../../shared-ui/store/actions/building";
import { IModule } from "../../shared-ui/models/module";
import { closeChildBladeAction } from "../../shared-ui/store/actions/app";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";

const columns: ColDef[] = [
  {
    field: "condominium.name",
    width: 250,
    headerName: "Condominio"
  },
  {
    field: "name",
    width: 250,
    headerName: "Nombre"
  }
];

const managerState = select(managerSelector);
const buildingState = select(buildingSelector);

export default function Building(props: IModule) {
  const condominium = useReduxState(managerState("condominium"));
  const building = useReduxState(buildingState("building"));
  const buildings = useReduxState(buildingState("buildings"));

  const create = useReduxAction(createBuildingAction());
  const update = useReduxAction(updateBuildingAction());
  const loadBuilding = useReduxAction(refreshBuildingsAction());
  const setBuilding = useReduxAction(setBuildingAction);

  const closeChildBlades = useReduxAction(closeChildBladeAction);

  const clear = () => {
    closeChildBlades(props.id);
    const payload = { condominiumId: condominium.id };
    setBuilding(payload);
  };

  const onOpenApartment = () => {
    props.history.push(`/apartments/${building.id}`);
  };

  useEffect(() => {
    if (condominium.id === building.condominiumId) return;
    const payload = { condominiumId: condominium.id };
    setBuilding(payload);
    loadBuilding(payload);
    closeChildBlades(props.id);
  }, [condominium.id]);

  return (
    <BladeTemplate
      header={
        <>
          {building.id && (
            <Button onClick={onOpenApartment}>Apartamentos</Button>
          )}

          <div style={{ flex: 1 }} />
          {!building.id && (
            <Button type="primary" onClick={() => create(building)}>
              Crear
            </Button>
          )}

          {building.id && (
            <Button type="primary" onClick={() => update(building)}>
              Guardar
            </Button>
          )}

          <Button style={{ marginLeft: 5 }} onClick={clear}>
            Limpiar
          </Button>
        </>
      }
    >
      <BuildingForm building={building} buildingChange={setBuilding} />
      <Col sm={24} md={24}>
        <div
          className="ag-theme-balham"
          style={{
            marginTop: 15,
            flexGrow: 1,
            minHeight: 100,
            height: 250,
            width: "100%"
          }}
        >
          <AgGridReact
            rowData={buildings}
            columnDefs={columns}
            onRowClicked={event => setBuilding(event.data)}
          />
        </div>
      </Col>
    </BladeTemplate>
  );
}
