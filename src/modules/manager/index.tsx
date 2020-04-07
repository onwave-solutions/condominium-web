import React, { useEffect, useState } from "react";
import _ from "lodash";

import get from "lodash/get";
import set from "lodash/set";

import { Rifm } from "rifm";
import { ColDef } from "ag-grid-community";
import { Tag, Layout, List } from "antd";

import Table, { Column } from "../../components/atoms/table";
import Col from "../../components/atoms/col";
import Icon from "../../components/atoms/icon";
import { Wrapper } from "../../components/atoms/body-wrapper";
import TenantCard from "../../components/molecules/tenant-card";
import Modal from "../../components/atoms/modal";
import Scrollbar from "../../components/atoms/scrollbar";
import Row from "../../components/atoms/row";
import Input from "../../components/atoms/input";

import ManagerWrapper from "../../components/molecules/ticket-wrapper";
import Button from "../../components/atoms/button";
import UserForm from "../../components/organisisms/user-form";
import SideList from "../../components/organisisms/side-list";
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
  updateManagerAction,
  setManagerByIdAction
} from "../../shared-ui/store/actions/manager.action";
import { IModule } from "../../shared-ui/models/module";
import { appSelector } from "../../shared-ui/store/selectors/app";
import { companySelector } from "../../shared-ui/store/selectors/company.selector";
import { loadCompaniesAction } from "../../shared-ui/store/actions/company.action";
import { Company } from "../../shared-ui/models/company.model";
import { User } from "../../shared-ui/models/user";
import CondominiumManagerForm from "../../components/organisisms/condominium-manager-form";
import { Condominium } from "../../shared-ui/models/condominium";
import { condominiumSelector } from "../../shared-ui/store/selectors/condominium";
import {
  refreshCondominiumsAction,
  addCondominiumManagerAction,
  dropCondominiumManagerAction
} from "../../shared-ui/store/actions/condominium.action";
import WrapperTemplate from "../../components/templates/wrapper-template";
import {
  idFormat,
  phoneFormat,
  isValidDocument
} from "../../shared-ui/utils/input";
import { validateEmail } from "../../shared-ui/utils/strings";
import { KeyOf } from "../../shared-ui/utils/objects";

const managerState = select(managerSelector);
const companyState = select(companySelector);
const condominiumState = select(condominiumSelector);
const appState = select(appSelector);

export default function Manager(props: IModule) {
  const [condominium, setCondominium] = useState<Condominium>({});
  const [visible, setVisibility] = useState<boolean>(false);
  const [condoVisible, setCondoVisibility] = useState<boolean>(false);
  const condominiums = useReduxState(condominiumState("condominiums"));
  const keylist = useReduxState(appState("keylist"));
  const manager = useReduxState(managerState("manager"));
  const managers = useReduxState(managerState("managers"));
  const companies: Company[] = useReduxState(companyState("companies"));

  const loadUsers = useReduxAction(loadManagerAction(props.id));
  const loadCompanies = useReduxAction(loadCompaniesAction(props.id));
  const loadCondominiums = useReduxAction(refreshCondominiumsAction(props.id));
  const setManager = useReduxAction(setManagerAction);
  const create = useReduxAction(signUpManagerAction(props.id));
  const update = useReduxAction(updateManagerAction(props.id));
  const getManagerById = useReduxAction(setManagerByIdAction);


  const addCondominiumManager = useReduxAction(
    addCondominiumManagerAction(props.id)
  );

  const dropCondominiumManager = useReduxAction(
    dropCondominiumManagerAction(props.id)
  );

  const onItemSelect = (name: string, value: any) => {
    const newManager = set({ ...manager }, name, value);
    setManager!(newManager);
  };

  useEffect(() => {
    loadUsers();
    loadCompanies();
    loadCondominiums();
  }, []);

  const handleOpenModal = (user: User) => () => {
    setManager(user);
    setVisibility(true);
  };

  const handleOpenCondoModal = () => {
    setCondominium({});
    setCondoVisibility(true);
  };

  const dropCondominiumFromManager = (condominiumId: number) => () => {
    dropCondominiumManager(
      {
        condominiumId: condominiumId,
        managerId: manager.id
      },
      () => {
        getManagerById(manager.id!);
        loadUsers();
      }
    );
  };

  const handleAction = async () => {
    const cb = () => setVisibility(false);
    if (manager.id) {
      await update(manager, cb);
    } else {
      await create(manager, cb);
    }
  };
  const handleActionCondo = async () => {
    await addCondominiumManager(
      {
        condominiumId: condominium.id,
        managerId: manager.id
      },
      () => {
        getManagerById(manager.id!);
        loadUsers();
      }
    );
    setCondoVisibility(false);
  };

  const onSelectUser = (user: User) => () => {
    setManager(user);
  };

  const getInUser = (path: KeyOf<User> | [KeyOf<User>], def?: any) =>
    get(manager, path, def);

  const isDocumentValid = isValidDocument(manager.documentId);
  const isValid =
    validateEmail(getInUser("username", "")) &&
    isDocumentValid(getInUser("document")) &&
    getInUser("documentId") &&
    getInUser("name");

  return (
    <>
      <Modal
        visible={condoVisible}
        okButtonProps={{
          disabled: !condominium.id
        }}
        onCancel={() => setCondoVisibility(false)}
        onOk={handleActionCondo}
        closable={false}
        title="Agregar Condominio"
      >
        <CondominiumManagerForm
          condominium={condominium}
          disableManager={true}
          manager={manager}
          managers={managers}
          onCondominiumChange={setCondominium}
          condominiums={condominiums}
        />
      </Modal>
      <Modal
        visible={visible}
        onCancel={() => setVisibility(false)}
        onOk={handleAction}
        closable={false}
        okButtonProps={{
          disabled: props.loading || !isValid
        }}
        title={`${manager.id ? "Actualizar" : "Crear"} Manager`}
      >
        <Row>
          <UserForm user={manager} userChanged={setManager} keylist={keylist} />
          <FormItem label="Teléfono">
            <Rifm
              value={manager!.phone!}
              format={phoneFormat}
              accept={/\d+/g}
              onChange={(value: string) => onItemSelect("phone", value)}
            >
              {({ value, onChange }) => (
                <Input value={value} onChange={onChange} name="phone" />
              )}
            </Rifm>
          </FormItem>
          <FormItem label="Celular">
            <Rifm
              value={manager!.cellphone!}
              format={phoneFormat}
              accept={/\d+/g}
              onChange={(value: string) => onItemSelect("cellphone", value)}
            >
              {({ value, onChange }) => (
                <Input value={value} onChange={onChange} name="cellphone" />
              )}
            </Rifm>
          </FormItem>
          <FormItem label="Dirección" md={24} sm={24}>
            <Input
              name="address"
              onChange={(event: any) =>
                onItemSelect(event.target.name, event.target.value)
              }
              value={manager!.address}
            />
          </FormItem>
          <FormItem label="Compañia" sm={24} md={24}>
            <Select
              name="company.id"
              data={companies}
              typeName="id"
              renderNode={(data: Company) => {
                return `${data.name} [${get(data, "documentType.name")}:${
                  data.document
                }]`;
              }}
              value={get(manager, "company.id")}
              onChangeItem={onItemSelect}
            />
          </FormItem>
        </Row>
      </Modal>
      <WrapperTemplate>
        <ManagerWrapper className="isomorphicNoteComponent">
          <div style={{ width: "320px" }} className="isoNoteListSidebar">
            <SideList
              items={managers}
              resetId={1}
              filterKeys={["name", "lastName", "document"]}
            >
              {(user: User) => {
                const activeClass = manager.id === user.id ? "active" : "";
                return (
                  <div
                    className={`isoList ${activeClass}`}
                    key={user.id}
                    onClick={onSelectUser(user)}
                  >
                    <div className="isoNoteBGColor" style={{ width: "5px" }} />
                    <div className="isoNoteText">
                      <h3>
                        {user.name} {user.lastName}
                      </h3>
                      <Tag
                        color={
                          user.status === "A"
                            ? "green"
                            : user.status === "I"
                            ? "red"
                            : "gold"
                        }
                      >
                        {user.statusRaw!.name}
                      </Tag>
                    </div>
                    <div style={{ flex: 1 }} />
                    {/*
                    <div className="isoNoteText">
                      <Icon
                        type="edit"
                        style={{ fontSize: 20 }}
                        onClick={handleOpenModal(user)}
                      />
                    </div>
                      */}
                  </div>
                );
              }}
            </SideList>
          </div>
          <Layout className="isoNotepadWrapper">
            <Layout.Header className="isoHeader">
              <div style={{ flex: 1 }} />
              <Button
                type="primary"
                className="isoAddNoteBtn"
                style={{ marginLeft: "0.5rem" }}
                onClick={handleOpenModal({})}
              >
                Crear Manager
              </Button>
              {manager.id && (
                <>
                  <Button
                    onClick={handleOpenModal(manager)}
                    type="primary"
                    className="isoAddNoteBtn"
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Editar Manager
                  </Button>
                  <Button
                    onClick={handleOpenCondoModal}
                    type="primary"
                    className="isoAddNoteBtn"
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Asignar Condominio
                  </Button>
                </>
              )}
            </Layout.Header>
            {manager.id && (
              <Layout.Content
                style={{
                  padding: "2rem",
                  paddingBottom: "0",
                  flexDirection: "column"
                }}
                className="isoNoteEditingArea"
              >
                <div
                  className="isoColorChooseWrapper"
                  style={{ marginBottom: "0.7rem" }}
                >
                  <h2 style={{ marginRight: "0.7rem" }}>
                    {manager.name} {manager.lastName}
                  </h2>
                </div>
                <Scrollbar className="contactBoxScrollbar">
                  {manager.id && (
                    <>
                      <TenantCard
                        tenant={manager}
                        otherAttributes={[
                          {
                            value: tenant => _.get(tenant, "company.name"),
                            title: "Compañia"
                          },
                          {
                            value: tenant => tenant.documentRaw!.name!,
                            title: "Tipo de Documento"
                          },
                          {
                            value: manager =>
                              manager.documentId === "CE"
                                ? idFormat(manager.document!)
                                : manager.document,
                            title: "Documento"
                          },
                          { value: "username", title: "Correo Eléctronico" },
                          { value: "address", title: "Dirección" },
                          {
                            value: manager => phoneFormat(manager.phone!),
                            title: "Teléfono"
                          },
                          {
                            value: manager => phoneFormat(manager.cellphone!),
                            title: "Celular"
                          },

                          {
                            value: manager => manager.statusRaw!.name!,
                            title: "Estado"
                          },
                          {
                            value: manager => manager.dueDay!,
                            title: "Día de pago"
                          },
                          {
                            value: manager => manager.monthlyFee!,
                            title: "Monto"
                          }
                        ]}
                      >
                        <List
                          header={<h4>Condominios Asignados</h4>}
                          dataSource={manager.condominiums || []}
                          renderItem={(item: Condominium) => {
                            return (
                              <List.Item
                                actions={[
                                  <a
                                    onClick={dropCondominiumFromManager(
                                      item.id!
                                    )}
                                  >
                                    Eliminar
                                  </a>
                                ]}
                              >
                                <div style={{ flex: 1 }}>{item.name}</div>
                              </List.Item>
                            );
                          }}
                        />
                      </TenantCard>
                    </>
                  )}
                </Scrollbar>
              </Layout.Content>
            )}
          </Layout>
        </ManagerWrapper>
      </WrapperTemplate>
    </>
  );
}
