import React, { useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

import Col from "../../components/atoms/col";
import Input from "../../components/atoms/input";
import Button from "../../components/atoms/button";
import UserForm from "../../components/organisisms/user-form";
import BladeTemplate from "../../components/templates/blade-template";
import Select from "../../components/atoms/select";
import FormItem from "../../components/molecules/form-item";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { select } from "../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import {
  loadManagerAction,
  setManagerAction,
  signUpManagerAction,
  updateManagerAction
} from "../../shared-ui/store/actions/manager.action";
import { IModule } from "../../shared-ui/models/module";
import { appSelector } from "../../shared-ui/store/selectors/app";
import { companySelector } from "../../shared-ui/store/selectors/company.selector";
import { loadCompaniesAction } from "../../shared-ui/store/actions/company.action";
import { Company } from "../../shared-ui/models/company.model";
import { User } from "../../shared-ui/models/user";

const managerState = select(managerSelector);
const companyState = select(companySelector);
const appState = select(appSelector);

export default function Manager(props: IModule) {
  const keylist = useReduxState(appState("keylist"));
  const manager = useReduxState(managerState("manager"));
  const managers = useReduxState(managerState("managers"));
  const companies: Company[] = useReduxState(companyState("companies"));

  const loadUsers = useReduxAction(loadManagerAction(props.id));
  const loadCompanies = useReduxAction(loadCompaniesAction(props.id));
  const setManager = useReduxAction(setManagerAction);
  const create = useReduxAction(signUpManagerAction(props.id));
  const update = useReduxAction(updateManagerAction(props.id));
  const clear = () => setManager({});

  const onItemSelect = (name: string, value: any) => {
    setManager!({ ...manager, [name]: value });
  };

  useEffect(() => {
    loadUsers();
    loadCompanies();
    return () => {
      clear();
    };
  }, []);

  return (
    <BladeTemplate
      footer={
        <>
          {!manager.id && (
            <Button size={"small"} onClick={() => create(manager)}>
              Crear
            </Button>
          )}
          {manager.id && (
            <Button size={"small"} onClick={() => update(manager)}>
              Guardar
            </Button>
          )}
          <Button size={"small"} onClick={clear} style={{ marginLeft: 5 }}>
            Limpiar
          </Button>
        </>
      }
    >
      <UserForm user={manager} userChanged={setManager} keylist={keylist} />
      <FormItem label="Dia de Pago">
        <Input
          name="dueDay"
          type="number"
          onChange={(event: any) =>
            onItemSelect(event.target.name, event.target.value)
          }
          value={manager!.dueDay}
        />
      </FormItem>
      <FormItem label="Monto">
        <Input
          name="monthlyFee"
          type="number"
          onChange={(event: any) =>
            onItemSelect(event.target.name, event.target.value)
          }
          value={manager!.monthlyFee}
        />
      </FormItem>
      <FormItem label="Compañia" sm={24} md={24}>
        <Select
          name="companyId"
          data={companies}
          typeName="id"
          renderNode={(data: Company) => {
            return <>{`${data.name} [${data.documentId}-${data.document}]`}</>;
          }}
          value={manager!.companyId}
          onChangeItem={onItemSelect}
        />
      </FormItem>

      <Col sm={24} md={24} style={{ paddingTop: 15 }}>
        <ManagerGrid managers={managers} setManager={setManager} />
      </Col>
    </BladeTemplate>
  );
}

export interface IManagerGrid {
  managers: User[];
  setManager?(manager: User): void;
}

export function ManagerGrid(props: IManagerGrid) {
  const { managers, setManager } = props;
  return (
    <div
      className="ag-theme-balham"
      style={{
        height: "180px",
        width: "100%"
      }}
    >
      <AgGridReact
        rowData={managers}
        columnDefs={columns}
        onRowClicked={event => setManager && setManager(event.data)}
      />
    </div>
  );
}

const columns: ColDef[] = [
  {
    field: "company.name",
    headerName: "Compañia"
  },
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
  },
  {
    field: "documentRaw.name",
    headerName: "Tipo de documento"
  },
  {
    field: "document",
    headerName: "Documento"
  }
];
