import React, { useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import UserForm from "../../components/organisisms/user-form";
import BladeTemplate from "../../components/templates/blade-template";
import { adminSelector } from "../../shared-ui/store/selectors/admin.selector";
import { select } from "../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import {
  loadAdminAction,
  setAdminAction,
  signUpAdminAction,
  updateAdminAction
} from "../../shared-ui/store/actions/admin.action";
import { IModule } from "../../shared-ui/models/module";
import { appSelector } from "../../shared-ui/store/selectors/app";

const columns: ColDef[] = [
  {
    field: "username",
    headerName: "Usuario"
  },
  {
    field: "statusRaw.name",
    headerName: "Estado"
  },
  {
    field: "name",
    headerName: "Nombre"
  },
  {
    field: "lastName",
    headerName: "Apellido"
  }
];

const adminState = select(adminSelector);
const appState = select(appSelector);

export default function Admin(props: IModule) {
  const keylist = useReduxState(appState("keylist"));
  const admin = useReduxState(adminState("admin"));
  const admins = useReduxState(adminState("admins"));
  const loadUsers = useReduxAction(loadAdminAction(props.id));
  const setAdmin = useReduxAction(setAdminAction);
  const create = useReduxAction(signUpAdminAction(props.id));
  const update = useReduxAction(updateAdminAction(props.id));
  const clear = () => setAdmin({});

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
          {!admin.id && (
            <Button size={"small"} onClick={() => create(admin)}>
              Crear
            </Button>
          )}
          {admin.id && (
            <Button size={"small"} onClick={() => update(admin)}>
              Guardar
            </Button>
          )}
          <Button size={"small"} onClick={clear} style={{ marginLeft: 5 }}>
            Limpiar
          </Button>
        </>
      }
    >
      <UserForm
        user={admin}
        userChanged={setAdmin}
        keylist={keylist}
        hideDocuments={true}
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
            rowData={admins}
            columnDefs={columns}
            onRowClicked={event => setAdmin(event.data)}
          />
        </div>
      </Col>
    </BladeTemplate>
  );
}
