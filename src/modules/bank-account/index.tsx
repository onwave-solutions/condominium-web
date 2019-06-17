import React, { useEffect } from "react";
import BladeTemplate from "../../components/templates/blade-template";
import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

import { IModule } from "../../shared-ui/models/module";
import { bankAccountSelector } from "../../shared-ui/store/selectors/bank-account.selector";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { select } from "../../shared-ui/store/selectors";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import {
  refreshBankAccountsAction,
  setBankAccountAction,
  createBankAccountAction,
  updateBankAccountAction
} from "../../shared-ui/store/actions/bank-account.actions";
import { closeChildBladeAction } from "../../shared-ui/store/actions/app";
import BankAccountForm from "../../components/organisisms/bank-account-form";
import { appSelector } from "../../shared-ui/store/selectors/app";

const bankAccountState = select(bankAccountSelector);
const managerState = select(managerSelector);
const appState = select(appSelector);

export default function BankAccount(props: IModule) {
  const keylist = useReduxState(appState("keylist"));
  const condominium = useReduxState(managerState("condominium"));
  const bankAccount = useReduxState(bankAccountState("bankAccount"));
  const bankAccounts = useReduxState(bankAccountState("bankAccounts"));

  const loadBankAccounts = useReduxAction(refreshBankAccountsAction());
  const setBankAccount = useReduxAction(setBankAccountAction);
  const closeChildBlades = useReduxAction(closeChildBladeAction);
  const create = useReduxAction(createBankAccountAction(props.id));
  const update = useReduxAction(updateBankAccountAction(props.id));
  const clear = () => setBankAccount({});

  useEffect(() => {
    if (condominium.id === bankAccount.condominiumId) return;
    const payload = { condominiumId: condominium.id };
    setBankAccount(payload);
    loadBankAccounts(payload);
    closeChildBlades(props.id);
  }, [condominium.id]);

  return (
    <BladeTemplate
      header={
        <>
          {!bankAccount.id && (
            <Button type="primary" onClick={() => create(bankAccount)}>
              Crear
            </Button>
          )}
          {bankAccount.id && (
            <Button type="primary" onClick={() => update(bankAccount)}>
              Guardar
            </Button>
          )}
          <Button onClick={clear} style={{ marginLeft: 5 }}>
            Limpiar
          </Button>
        </>
      }
    >
      <BankAccountForm
        bankAccount={bankAccount}
        keylist={keylist}
        bankAccountChange={setBankAccount}
      />
      <Col sm={24} md={24} style={{ paddingTop: 15 }}>
        <div
          className="ag-theme-balham"
          style={{
            height: "280px",
            width: "100%"
          }}
        >
          <AgGridReact
            rowData={bankAccounts}
            columnDefs={columns}
            onRowClicked={event => setBankAccount && setBankAccount(event.data)}
          />
        </div>
      </Col>
    </BladeTemplate>
  );
}

const columns: ColDef[] = [
  {
    field: "bank.name",
    headerName: "Banco"
  },
  {
    field: "account",
    headerName: "Número de Cuenta"
  },
  {
    field: "balance",
    headerName: "Balance"
  },
  {
    field: "description",
    headerName: "Descripción"
  }
];
