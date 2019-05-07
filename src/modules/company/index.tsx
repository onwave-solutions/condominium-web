import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

import Col from "../../components/atoms/col";
import BladeTemplate from "../../components/templates/blade-template";
import CompanyForm from "../../components/organisisms/company-form";

export default function Company() {
  return (
    <BladeTemplate>
      <CompanyForm />
      <Col sm={24} md={24}>
        <div
          className="ag-theme-balham"
          style={{
            marginTop: 15,
            height: "170px",
            width: "100%"
          }}
        >
          <AgGridReact
            rowData={[]}
            columnDefs={columns}
            onRowClicked={event => undefined}
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
    field: "state",
    headerName: "Estado"
  },
  {
    field: "documentType",
    headerName: "Tipo de documento"
  },
  {
    field: "document",
    headerName: "Documento"
  },
  {
    field: "phone",
    headerName: "Teléfono"
  }
];
