import React, { useEffect, useState } from "react";
import _ from 'lodash'
import { ColDef } from "ag-grid-community";
import { Tag, Layout, List} from "antd";

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
    setManager!({ ...manager, [name]: value });
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
    if (manager.id) {
      await update(manager);
    } else {
      await create(manager);
    }
    setVisibility(false);
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

  return (
    <>
      <Modal
        visible={condoVisible}
        okButtonProps={{ disabled: !condominium.id }}
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
        title={`${manager.id ? "Actualizar" : "Crear"} Manager`}
      >
        <Row>
          <UserForm user={manager} userChanged={setManager} keylist={keylist} />
          <FormItem label="Teléfono">
            <Input
              name="phone"
              type="number"
              onChange={(event: any) =>
                onItemSelect(event.target.name, event.target.value)
              }
              value={manager!.phone}
            />
          </FormItem>
          <FormItem label="Celular">
            <Input
              name="cellphone"
              type="number"
              onChange={(event: any) =>
                onItemSelect(event.target.name, event.target.value)
              }
              value={manager!.cellphone}
            />
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
                return (
                  <>{`${data.name} [${data.documentId}-${data.document}]`}</>
                );
              }}
              value={manager!.companyId}
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
                    <div className="isoNoteText">
                      <Icon
                        type="edit"
                        style={{ fontSize: 20 }}
                        onClick={handleOpenModal(user)}
                      />
                    </div>
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
                <Button
                  onClick={handleOpenCondoModal}
                  type="primary"
                  className="isoAddNoteBtn"
                  style={{ marginLeft: "0.5rem" }}
                >
                  Agregar Condominio
                </Button>
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
                            value: tenant => _.get(tenant, 'company.name'),
                            title: "Compañia"
                          },
                          {
                            value: tenant => tenant.documentRaw!.name!,
                            title: "Tipo de Documento"
                          },
                          { value: "document", title: "Documento" },
                          { value: "username", title: "Correo Eléctronico" },
                          { value: "address", title: "Dirección" },
                          { value: "phone", title: "Teléfono" },
                          { value: "cellphone", title: "Celular" },
                          {
                            value: tenant => tenant.statusRaw!.name!,
                            title: "Estado"
                          },
                          {
                            value: tenant => tenant.dueDay!,
                            title: "Día de pago"
                          },
                          {
                            value: tenant => tenant.monthlyFee!,
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
