import React, { useEffect, useState } from "react";
import BladeTemplate from "../../components/templates/blade-template";
import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import Modal from "../../components/atoms/modal";
import Row from "../../components/atoms/row";
import Scrollbar from "../../components/atoms/scrollbar";
import Table, { Column } from "../../components/atoms/table";
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
import { Wrapper } from "../../components/atoms/body-wrapper";
import { BankAccount } from "../../shared-ui/models/bank-account";
import { currencyFormat } from '../../shared-ui/utils/currency';

const bankAccountState = select(bankAccountSelector);
const managerState = select(managerSelector);
const appState = select(appSelector);

export default function BankAccountView(props: IModule) {
  const [bankAccModal, setBankModal] = useState<boolean>(false);
  const keylist = useReduxState(appState("keylist"));
  const condominium = useReduxState(managerState("condominium"));
  const bankAccount = useReduxState(bankAccountState("bankAccount"));
  const bankAccounts = useReduxState(bankAccountState("bankAccounts"));

  const loadBankAccounts = useReduxAction(refreshBankAccountsAction());
  const setBankAccount = useReduxAction(setBankAccountAction);
  const create = useReduxAction(createBankAccountAction(props.id));
  const update = useReduxAction(updateBankAccountAction(props.id));
  const clear = () => setBankAccount({});


  const formatter = currencyFormat(condominium);

  useEffect(() => {
    if (condominium.id === bankAccount.condominiumId) return;
    const payload = { condominiumId: condominium.id };
    setBankAccount(payload);
    loadBankAccounts(payload);
  }, [condominium.id]);

  const handleOpenModal = (bankAcc: BankAccount) => () => {
    setBankAccount(bankAcc);
    setBankModal(true);
  };

  const showTransactions = (bank: BankAccount) => () => {
    props.history.push(`/transactions/${bank.id}`);
  };

  const handleAction = async () => {
    if (bankAccount.id) {
      await update(bankAccount);
    } else {
      await create(bankAccount);
    }
    setBankModal(false);
  };

  return (
    <>
      <Modal
        visible={bankAccModal}
        onCancel={() => setBankModal(false)}
        onOk={handleAction}
        closable={false}
        title={`${bankAccount.id ? "Actualizar" : "Crear"} Caja`}
      >
        <Row>
          <BankAccountForm
            bankAccount={bankAccount}
            keylist={keylist}
            bankAccountChange={setBankAccount}
          />
        </Row>
      </Modal>
      <BladeTemplate
        header={
          <>
            <Button
              type="primary"
              onClick={handleOpenModal({ condominiumId: condominium.id })}
            >
              Crear
            </Button>
          </>
        }
      >
        <Wrapper>
          <Scrollbar style={{ width: "100%" }}>
            <Table
              dataSource={bankAccounts}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            >
              <Column
                title="Caja"
                dataIndex="bankName"
                width="80px"
                render={(_: string, bankAcc: BankAccount) => (
                  <span>{bankAcc.bank!.name}</span>
                )}
              />
              <Column
                title="Número de Referencia"
                dataIndex="account"
                width="80px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Balance"
                dataIndex="balance"
                width="80px"
                render={(text: number) => <span>{formatter(text)}</span>}
              />
              <Column
                title="Descripción"
                dataIndex="description"
                width="80px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Editar"
                dataIndex={"edit"}
                width={"5%"}
                render={(_: string, bank: BankAccount) => (
                  <Button onClick={handleOpenModal(bank)} icon="edit" />
                )}
              />
            </Table>
          </Scrollbar>
        </Wrapper>
      </BladeTemplate>
    </>
  );
}
