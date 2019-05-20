import React, { useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import BladeTemplate from "../../components/templates/blade-template";
import CompanyForm from "../../components/organisisms/company-form";

import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { appSelector } from "../../shared-ui/store/selectors/app";
import { select } from "../../shared-ui/store/selectors";
import { companySelector } from "../../shared-ui/store/selectors/company.selector";
import { IModule } from "../../shared-ui/models/module";
import {
  loadCompaniesAction,
  setCompanyAction,
  createCompanyAction,
  updateCompanyAction
} from "../../shared-ui/store/actions/company.action";

const companyState = select(companySelector);
const appState = select(appSelector);

export default function Company(props: IModule) {
  const company = useReduxState(companyState("company"));
  const companies = useReduxState(companyState("companies"));
  const keylist = useReduxState(appState("keylist"));

  const loadCompanies = useReduxAction(loadCompaniesAction(props.id));
  const setCompany = useReduxAction(setCompanyAction);
  const create = useReduxAction(createCompanyAction(props.id));
  const update = useReduxAction(updateCompanyAction(props.id));
  const clear = () => setCompany({});

  useEffect(() => {
    loadCompanies();
    return () => {
      clear();
    };
  }, []);

  return (
    <BladeTemplate
      footer={
        <>
          {!company.id && (
            <Button size={"small"} onClick={() => create(company)}>
              Crear
            </Button>
          )}
          {company.id && (
            <Button size={"small"} onClick={() => update(company)}>
              Guardar
            </Button>
          )}
          <Button size={"small"} onClick={clear} style={{ marginLeft: 5 }}>
            Limpiar
          </Button>
        </>
      }
    >
      <CompanyForm
        company={company}
        keylist={keylist}
        companyChange={setCompany}
      />
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
            rowData={companies}
            columnDefs={columns}
            onRowClicked={event => setCompany(event.data)}
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
    field: "documentId",
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
