import { idFormat } from "../../shared-ui/utils/input";
import React, { useState, useEffect } from "react";

import { Layout, List } from "antd";
import { IModule } from "../../shared-ui/models/module";
import Button from "../../components/atoms/button";
import Scrollbar from "../../components/atoms/scrollbar";
import { select } from "../../shared-ui/store/selectors";
import { ContactsWrapper } from "./style";
import TenantContactList from "../../components/organisisms/tenant-contact-list";
import TenantCreateForm from "../../components/organisisms/tenant-create-form";
import { appSelector } from "../../shared-ui/store/selectors/app";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { tenantSelector } from "../../shared-ui/store/selectors/tenant.selector";
import {
  signUpTenantAction,
  loadTenantAction,
  setTenantAction,
  addApartmentToTenant,
  findTenantBy,
  updateTenantAction,
  removeApartmentFromTenant
} from "../../shared-ui/store/actions/tenant.action";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { User } from "../../shared-ui/models/user";
import TenantCard from "../../components/molecules/tenant-card";
import ApartmentSelect from "../../components/organisisms/apartment-select";
import { BuildingService } from "../../shared-ui/services/building";
import { ApartmentService } from "../../shared-ui/services/apartment";
import WrapperTemplate from "../../components/templates/wrapper-template";
import { Apartment } from "../../shared-ui/models/apartment";
import { phoneFormat } from "../../shared-ui/utils/input";

const { Content } = Layout;

const appState = select(appSelector);
const managerState = select(managerSelector);
const tenantState = select(tenantSelector);
const buildingService = new BuildingService();
const apartmentService = new ApartmentService();

export default function TenantList(props: IModule) {
  const [visible, setVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [apartmentVisible, setApartmentVisible] = useState<boolean>(false);
  //const [tenant, setTenant] = useState<User>({});
  const tenant = useReduxState(tenantState("tenant"));
  const keylist = useReduxState(appState("keylist"));
  const condominium = useReduxState(managerState("condominium"));
  const tenants = useReduxState(tenantState("tenants"));

  const createTenant = useReduxAction(
    signUpTenantAction(props.id, condominium.id)
  );

  const updateTenant = useReduxAction(
    updateTenantAction(props.id, condominium.id)
  );

  const loadTenants = useReduxAction(loadTenantAction(props.id));
  const setTenant = useReduxAction(setTenantAction);
  const addApartment = useReduxAction(
    addApartmentToTenant(props.id, condominium.id)
  );

  const removeApartment = useReduxAction(
    removeApartmentFromTenant(props.id, condominium.id)
  );

  const handleModalVisibility = (status: boolean) => {
    return () => setVisible(status);
  };

  const handleEditModalVisibility = (status: boolean) => {
    return () => setEditVisible(status);
  };

  const handleApartmentModalVisibility = (status: boolean) => {
    return () => setApartmentVisible(status);
  };

  const handleCreateTenant = (tenant: User) => {
    createTenant(tenant, () => {
      setVisible(false);
    });
  };

  const handleUpdateTenant = (tenant: User) => {
    updateTenant(tenant, () => {
      setEditVisible(false);
    });
  };

  const handleAddApartment = async (id: number) => {
    await addApartment(tenant.id!, id);
    setApartmentVisible(false);
  };

  useEffect(() => {
    loadTenants(condominium.id!);
    setTenant({});
  }, [condominium.id]);

  return (
    <>
      <WrapperTemplate>
        <ContactsWrapper
          className="isomorphicContacts"
          style={{ background: "none" }}
        >
          <div className="isoContactListBar">
            <TenantContactList
              users={tenants}
              selectedId={tenant.id}
              onSelect={setTenant}
            />
          </div>
          <Layout className="isoContactBoxWrapper">
            <Content className="isoContactBox">
              <div className="isoContactControl">
                <div style={{ flex: 1 }} />
                <Button
                  type="primary"
                  className="isoAddContactBtn"
                  onClick={handleModalVisibility(true)}
                >
                  Agregar Nuevo Inquilino
                </Button>

                {tenant.id && (
                  <>
                    <Button
                      type="primary"
                      className="isoAddContactBtn"
                      onClick={handleEditModalVisibility(true)}
                    >
                      Editar Perfil
                    </Button>
                    <Button
                      type="primary"
                      className="isoAddContactBtn"
                      onClick={handleApartmentModalVisibility(true)}
                    >
                      Asignar Apartamento
                    </Button>
                  </>
                )}
              </div>
              <Scrollbar className="contactBoxScrollbar">
                {tenant.id && (
                  <TenantCard
                    tenant={tenant}
                    otherAttributes={[
                      {
                        value: tenant => tenant.documentRaw!.name!,
                        title: "Tipo de Documento"
                      },
                      {
                        value: tenant =>
                          tenant.documentId === "CE"
                            ? idFormat(tenant.document!)
                            : tenant.document!,
                        title: "Documento"
                      },
                      { value: "username", title: "Correo Eléctronico" },
                      {
                        value: tenant => tenant.statusRaw!.name!,
                        title: "Estado"
                      },
                      {
                        value: tenant => phoneFormat(tenant.phone!),
                        title: "Teléfono"
                      },
                      {
                        value: tenant => phoneFormat(tenant.cellphone!),
                        title: "Celular"
                      },
                      {
                        value: "address",
                        title: "Dirección"
                      }
                    ]}
                  >
                    <List
                      header={<h4>Apartamentos Asignados</h4>}
                      dataSource={(tenant.apartments || []).filter(
                        x => x.building!.condominiumId === condominium.id
                      )}
                      renderItem={(item: Apartment) => {
                        return (
                          <List.Item
                            actions={[
                              <a
                                onClick={() =>
                                  removeApartment(tenant.id!, item.id!)
                                }
                              >
                                Eliminar
                              </a>
                            ]}
                          >
                            <div style={{ flex: 1 }}>
                              {item.name} [{item.building!.name}]
                            </div>
                          </List.Item>
                        );
                      }}
                    />
                  </TenantCard>
                )}
              </Scrollbar>
            </Content>
          </Layout>
        </ContactsWrapper>
      </WrapperTemplate>
      <TenantCreateForm
        visible={visible}
        onSearchTenant={findTenantBy}
        onAction={handleCreateTenant}
        onClose={handleModalVisibility(false)}
        keylist={keylist}
      />
      <TenantCreateForm
        visible={editVisible}
        tenant={tenant}
        onSearchTenant={findTenantBy}
        onAction={handleUpdateTenant}
        onClose={handleEditModalVisibility(false)}
        keylist={keylist}
      />
      <ApartmentSelect
        condominiumId={condominium.id}
        visible={apartmentVisible}
        onClose={handleApartmentModalVisibility(false)}
        getBuildings={id =>
          buildingService.query({ condominiumId: id }, { name: "ASC" })
        }
        getApartments={id =>
          apartmentService.query({ buildingId: id }, { name: "ASC" })
        }
        onAction={handleAddApartment}
      />
    </>
  );
}
