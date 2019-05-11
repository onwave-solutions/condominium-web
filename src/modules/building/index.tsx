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
import { condominiumSelector } from "../../shared-ui/store/selectors/condominium";
import { buildingSelector } from "../../shared-ui/store/selectors/building";
import {
  setBuildingAction,
  createBuildingAction,
  updateBuildingAction,
  refreshBuildingsAction
} from "../../shared-ui/store/actions/building";
import { IModule } from "../../shared-ui/models/module";
import {
  closeChildBladeAction,
  addChildBlade
} from "../../shared-ui/store/actions/app";

const columns: ColDef[] = [
  {
    field: "condominiumId",
    width: 250,
    headerName: "Condominio"
  },
  {
    field: "name",
    width: 250,
    headerName: "Nombre"
  }
];

const condominiumState = select(condominiumSelector);
const buildingState = select(buildingSelector);

export default function Building(props: IModule) {
  const condominium = useReduxState(condominiumState("condominium"));
  const building = useReduxState(buildingState("building"));
  const buildings = useReduxState(buildingState("buildings"));

  const create = useReduxAction(createBuildingAction());
  const update = useReduxAction(updateBuildingAction());
  const loadBuilding = useReduxAction(refreshBuildingsAction());
  const setBuilding = useReduxAction(setBuildingAction);

  const handleAddBlade = useReduxAction(addChildBlade(props.id));
  const closeChildBlades = useReduxAction(closeChildBladeAction);

  const clear = () => {
    closeChildBlades(props.id);
    setBuilding({});
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
            <Button
              size={"small"}
              onClick={() => handleAddBlade(apartmentModule.id)}
            >
              Apartamentos
            </Button>
          )}
        </>
      }
      footer={
        <>
          {!building.id && (
            <Button size={"small"} onClick={() => create(building)}>
              Crear
            </Button>
          )}

          {building.id && (
            <Button size={"small"} onClick={() => update(building)}>
              Guardar
            </Button>
          )}

          <Button size={"small"} style={{ marginLeft: 5 }} onClick={clear}>
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
