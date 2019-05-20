import React, { useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import UserForm from "../../components/organisisms/user-form";
import BladeTemplate from "../../components/templates/blade-template";
import { tenantSelector } from "../../shared-ui/store/selectors/tenant.selector";
import { select } from "../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import {
  loadTenantAction,
  setTenantAction,
  signUpTenantAction,
  updateTenantAction
} from "../../shared-ui/store/actions/tenant.action";
import { IModule } from "../../shared-ui/models/module";
import { appSelector } from "../../shared-ui/store/selectors/app";

const columns: ColDef[] = [
  {
    field: "username",
    headerName: "Condominio"
  },
  {
    field: "status",
    headerName: "Edificio"
  },
  {
    field: "name",
    headerName: "Apartamento"
  }
];

const tenantState = select(tenantSelector);
const appState = select(appSelector);

export default function Tenant(props: IModule) {
  const keylist = useReduxState(appState("keylist"));
  const tenant = useReduxState(tenantState("tenant"));
  const loadUsers = useReduxAction(loadTenantAction(props.id));
  const setTenant = useReduxAction(setTenantAction);
  const create = useReduxAction(signUpTenantAction(props.id));
  const update = useReduxAction(updateTenantAction(props.id));
  const clear = () => setTenant({});

  useEffect(() => {
    loadUsers();
    return () => {
      clear();
    };
  }, []);

  return (
    <BladeTemplate
      footer={
        <>
          {!tenant.id && (
            <Button size={"small"} onClick={() => create(tenant)}>
              Crear
            </Button>
          )}
          {tenant.id && (
            <Button size={"small"} onClick={() => update(tenant)}>
              Guardar
            </Button>
          )}
          <Button size={"small"} onClick={clear} style={{ marginLeft: 5 }}>
            Limpiar
          </Button>
        </>
      }
    >
      <UserForm user={tenant} userChanged={setTenant} keylist={keylist} />
      {tenant.id && tenant.apartments!.length && (
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
              rowData={tenant.apartments}
              columnDefs={columns}
              onRowClicked={event => setTenant(event.data)}
            />
          </div>
        </Col>
      )}
    </BladeTemplate>
  );
}
