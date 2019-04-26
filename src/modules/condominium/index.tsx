import React, { useState, useEffect } from "react";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AgGridReact } from "ag-grid-react";

import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import CondominiumForm from "../../components/organisisms/condominium-form";
import BladeTemplate from "../../components/templates/blade-template";
import { Condominium } from "../../shared-ui/models/condominium";
import {
  createCondominium,
  getCondominium
} from "../../shared-ui/services/condominiums";

const columns: ColDef[] = [
  {
    field: "name",
    headerName: "Nombre"
  },
  {
    field: "address",
    headerName: "Dirección"
  },
  {
    field: "longitude",
    headerName: "Longitud"
  },
  {
    field: "latitude",
    headerName: "Latitud"
  }
];

export default function CondominiumBlade() {
  const [condominium, setCondominium] = useState<Condominium>({});
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);

  const loadCondominium = () => getCondominium().then(setCondominiums);
  const clear = () => setCondominium({});
  const create = async () => {
    await createCondominium(condominium);
    clear();
    await loadCondominium();
  };

  useEffect(() => {
    loadCondominium();
  }, []);

  return (
    <BladeTemplate
      footer={
        <>
          {!condominium._id && (
            <Button size={"small"} onClick={create}>
              Crear
            </Button>
          )}

          {condominium._id && <Button size={"small"}>Guardar</Button>}

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
