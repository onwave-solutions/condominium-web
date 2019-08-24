import React, { useEffect, useState } from "react";

import Table, { Column } from "../../components/atoms/table";
import Button from "../../components/atoms/button";
import Modal from "../../components/atoms/modal";
import Row from "../../components/atoms/row";
import UserForm from "../../components/organisisms/user-form";
import BladeTemplate from "../../components/templates/blade-template";
import Scrollbar from "../../components/atoms/scrollbar";
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
import { Wrapper } from "../../components/atoms/body-wrapper";
import { User } from "../../shared-ui/models/user";
import useSearch from "../../components/hooks/use-table-search";
import ColumnInputFilter from "../../components/molecules/column-input-filter";
import ColumnSelectFilter from "../../components/molecules/column-select-filter";

const adminState = select(adminSelector);
const appState = select(appSelector);

export default function Admin(props: IModule) {
  const { onFilter, handleSearch, handleReset } = useSearch();
  const [visible, setVisibility] = useState<boolean>(false);
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

  const handleOpenModal = (user: User) => () => {
    setAdmin(user);
    setVisibility(true);
  };

  const handleAction = async () => {
    const cb = () => setVisibility(false);
    if (admin.id) {
      await update(admin, cb);
    } else {
      await create(admin, cb);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={() => setVisibility(false)}
        onOk={handleAction}
        closable={false}
        title={`${admin.id ? "Actualizar" : "Crear"} Administrador`}
      >
        <Row>
          <UserForm
            hideDocuments={true}
            keylist={keylist}
            user={admin}
            userChanged={setAdmin}
          />
        </Row>
      </Modal>

      <BladeTemplate
        header={
          <>
            <Button type="primary" onClick={handleOpenModal({})}>
              Crear
            </Button>
          </>
        }
      >
        <Wrapper>
          <Scrollbar style={{ width: "100%" }}>
            <Table dataSource={admins} rowKey="id" pagination={{ pageSize: 5 }}>
              <Column
                title="Email"
                dataIndex="username"
                onFilter={onFilter(record => record.username)}
                filterDropdown={(filterProps: any) => (
                  <ColumnInputFilter
                    {...filterProps}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                width="80px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Estado"
                dataIndex="status"
                width="80px"
                filterDropdown={(filterProps: any) => (
                  <ColumnSelectFilter
                    {...filterProps}
                    data={keylist.userStatus}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                onFilter={onFilter(record => record.status || "")}
                render={(_: string, user: User) => (
                  <span>{user.statusRaw!.name}</span>
                )}
              />
              <Column
                title="Nombre"
                dataIndex="name"
                width="80px"
                onFilter={onFilter(record => record.name)}
                filterDropdown={(filterProps: any) => (
                  <ColumnInputFilter
                    {...filterProps}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Apellido"
                dataIndex="lastName"
                onFilter={onFilter(record => record.lastName)}
                filterDropdown={(filterProps: any) => (
                  <ColumnInputFilter
                    {...filterProps}
                    handleSearch={handleSearch}
                    handleReset={handleReset}
                  />
                )}
                width="80px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Editar"
                dataIndex={"edit"}
                width={"5%"}
                render={(_: string, user: User) => (
                  <>
                    <Button onClick={handleOpenModal(user)} icon="edit" />
                  </>
                )}
              />
            </Table>
          </Scrollbar>
        </Wrapper>
      </BladeTemplate>
    </>
  );
}
