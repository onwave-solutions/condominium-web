import React, { useEffect } from "react";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AgGridReact } from "ag-grid-react";

import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import CondominiumForm from "../../components/organisisms/condominium-form";
import BladeTemplate from "../../components/templates/blade-template";

import { select } from "../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { condominiumSelector } from "../../shared-ui/store/selectors/condominium";
import {
  setCondominiumAction,
  createCondominiumAction,
  updateCondominiumAction,
  refreshCondominiumsAction
} from "../../shared-ui/store/actions/condominium";

import buildingModule from "../building/module";
import {
  addChildBlade,
  closeChildBladeAction
} from "../../shared-ui/store/actions/app";
import { IModule } from "../../shared-ui/models/module";

const columns: ColDef[] = [
  {
    field: "name",
    headerName: "Nombre"
  },
  {
    field: "address",
    headerName: "Dirección"
  }
  //  {
  //    field: "longitude",
  //    headerName: "Longitud"
  //  },
  //  {
  //    field: "latitude",
  //    headerName: "Latitud"
  //  }
];

const condominiumState = select(condominiumSelector);

export default function CondominiumBlade(props: IModule) {
  const condominium = useReduxState(condominiumState("condominium"));
  const condominiums = useReduxState(condominiumState("condominiums"));

  const setCondominium = useReduxAction(setCondominiumAction);
  const create = useReduxAction(createCondominiumAction());
  const update = useReduxAction(updateCondominiumAction());
  const loadCondominium = useReduxAction(refreshCondominiumsAction());

  const handleAddBlade = useReduxAction(addChildBlade(props.id));
  const closeChildBlades = useReduxAction(closeChildBladeAction);

  const clear = () => {
    closeChildBlades(props.id);
    setCondominium({});
  };

  useEffect(() => {
    loadCondominium();
  }, []);

  return (
    <BladeTemplate
      header={
        <>
          {condominium.id && (
            <Button
              size={"small"}
              onClick={() => handleAddBlade(buildingModule.id)}
            >
              Edificios
            </Button>
          )}
        </>
      }
      footer={
        <>
          {!condominium.id && (
            <Button size={"small"} onClick={() => create(condominium)}>
              Crear
            </Button>
          )}

          {condominium.id && (
            <Button size={"small"} onClick={() => update(condominium)}>
              Guardar
            </Button>
          )}

          <Button size={"small"} style={{ marginLeft: 5 }} onClick={clear}>
            Limpiar
          </Button>
        </>
      }
    >
      <CondominiumForm
        condominium={condominium}
        condominiumChanged={setCondominium}
      />
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
            rowData={condominiums}
            columnDefs={columns}
            onRowClicked={event => setCondominium(event.data)}
          />
        </div>
      </Col>
    </BladeTemplate>
  );
}
