import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import UserForm from "../../components/organisisms/user-form";
import BladeTemplate from "../../components/templates/blade-template";
import { User } from "../../shared-ui/models/user";
import { getUsers, createUser } from "../../shared-ui/services/users";

export interface IManager {}

const columns: ColDef[] = [
  {
    field: "username",
    headerName: "Usuario"
  },
  {
    field: "state",
    headerName: "Estado"
  },
  {
    field: "firstName",
    headerName: "Nombre"
  },
  {
    field: "lastName",
    headerName: "Apellido"
  },
  {
    field: "documentType",
    headerName: "Tipo de documento"
  },
  {
    field: "document",
    headerName: "Documento"
  }
];

export default function Manager(props: IManager) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({});
  const loadUsers = () => getUsers().then(setUsers);
  const clear = () => setUser({});
  const create = async () => {
    await createUser(user);
    clear();
    await loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <BladeTemplate
      footer={
        <>
          {!user._id && (
            <Button size={"small"} onClick={create}>
              Crear
            </Button>
          )}

          {user._id && <Button size={"small"}>Guardar</Button>}

          <Button size={"small"} onClick={clear} style={{ marginLeft: 5 }}>
            Limpiar
          </Button>
        </>
      }
    >
      <UserForm user={user} userChanged={setUser} />
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
            rowData={users}
            columnDefs={columns}
            onRowClicked={event => setUser(event.data)}
          />
        </div>
      </Col>
    </BladeTemplate>
  );
}
