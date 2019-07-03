import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AgGridReact } from "ag-grid-react";

import Col from "../../components/atoms/col";
import Row from "../../components/atoms/row";
import Icon from "../../components/atoms/icon";
import Button from "../../components/atoms/button";
import Modal from "../../components/atoms/modal";
import Scrollbar from "../../components/atoms/scrollbar";
import BuildingForm from "../../components/organisisms/building-form";
import BuildingWrapper from "../../components/molecules/ticket-wrapper";
import BladeTemplate from "../../components/templates/blade-template";
import apartmentModule from "../apartment/module";

import { select } from "../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { buildingSelector } from "../../shared-ui/store/selectors/building";
import {
  setBuildingAction,
  createBuildingAction,
  updateBuildingAction,
  refreshBuildingsAction
} from "../../shared-ui/store/actions/building";
import { IModule } from "../../shared-ui/models/module";
import { closeChildBladeAction } from "../../shared-ui/store/actions/app";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import SideList from "../../components/organisisms/side-list";
import { Building } from "../../shared-ui/models/building";
import ApartmentView from "../apartment";
import ApartmentModal from "../../components/organisisms/apartment-modal";
import { apartmentSelector } from "../../shared-ui/store/selectors/apartment";
import { loadServicesAction } from "../../shared-ui/store/actions/service.action";
import { serviceSelector } from "../../shared-ui/store/selectors/service.selector";
import {
  setApartmentAction,
  createApartmentAction,
  updateApartmentAction
} from "../../shared-ui/store/actions/apartment";
import { Apartment } from "../../shared-ui/models/apartment";
import WrapperTemplate from "../../components/templates/wrapper-template";
import TenantContactList from "../../components/organisisms/tenant-contact-list";
import { tenantSelector } from "../../shared-ui/store/selectors/tenant.selector";
import {
  loadTenantAction,
  addApartmentToTenant
} from "../../shared-ui/store/actions/tenant.action";
import TenantSelectForm from "../../components/organisisms/tenant-select";

const managerState = select(managerSelector);
const buildingState = select(buildingSelector);
const apartmentState = select(apartmentSelector);
const serviceState = select(serviceSelector);
const tenantState = select(tenantSelector);

export default function BuildingView(props: IModule) {
  const [building, setBuilding] = useState<Building>({});
  const [apartmentModal, setApartmentModal] = useState<boolean>(false);
  const [buildingModal, setBuildingModal] = useState<boolean>(false);
  const [tenantModal, setTenantModal] = useState<boolean>(false);
  const condominium = useReduxState(managerState("condominium"));
  const selected = useReduxState(buildingState("building"));
  const apartment = useReduxState(apartmentState("apartment"));
  const services = useReduxState(serviceState("services"));
  const buildings = useReduxState(buildingState("buildings"));
  const tenants = useReduxState(tenantState("tenants"));

  const create = useReduxAction(createBuildingAction());
  const update = useReduxAction(updateBuildingAction());
  const createApartment = useReduxAction(createApartmentAction());
  const updateApartment = useReduxAction(updateApartmentAction());

  const loadBuilding = useReduxAction(refreshBuildingsAction());
  const loadTenants = useReduxAction(loadTenantAction(props.id));
  const loadServices = useReduxAction(loadServicesAction());
  const setSelected = useReduxAction(setBuildingAction);
  const setApartment = useReduxAction(setApartmentAction);
  const addApartment = useReduxAction(
    addApartmentToTenant(props.id, condominium.id)
  );

  const onSelectBuilding = (building: Building) => () => {
    setSelected(building);
  };

  const onOpenApartment = (apartment: Apartment) => () => {
    setApartment(apartment);
    setApartmentModal(true);
  };

  const onOpenBuilding = (building: Building) => () => {
    setBuilding(building);
    setBuildingModal(true);
  };

  const onOpenTenant = (apartment: Apartment) => {
    setApartment(apartment);
    setTenantModal(true);
  };

  const onCreateApartment = async () => {
    if (apartment.id) {
      await updateApartment(apartment);
    } else {
      await createApartment(apartment);
    }
    setApartmentModal(false);
  };

  const onCreateBuilding = async () => {
    if (building.id) {
      await update(building);
    } else {
      await create(building);
    }
    setBuildingModal(false);
  };

  const onAddTenant = async (tenantId: number) => {
    await addApartment(tenantId, apartment.id!, () => {
      const payload = { condominiumId: condominium.id };
      const building = { ...selected };
      setSelected({});
      setTimeout(() => {
        setSelected(building);
      });
      setTenantModal(false);
    });
  };

  useEffect(() => {
    if (condominium.id === selected.condominiumId) return;
    const payload = { condominiumId: condominium.id };
    setSelected(payload);
    loadBuilding(payload);
    loadServices(payload);
    loadTenants(condominium.id!);
  }, [condominium.id]);

  return (
    <>
      <ApartmentModal
        apartment={apartment}
        services={services}
        visible={apartmentModal}
        onCancel={() => setApartmentModal(false)}
        onOk={onCreateApartment}
        apartmentChange={setApartment}
      />
      <Modal
        title={(building.id ? "Modificar " : "Actualizar ") + "Edificio"}
        visible={buildingModal}
        onOk={onCreateBuilding}
        onCancel={() => setBuildingModal(false)}
      >
        <Row>
          <BuildingForm building={building} buildingChange={setBuilding} />
        </Row>
      </Modal>
      <TenantSelectForm
        visible={tenantModal}
        onClose={() => setTenantModal(false)}
        tenants={tenants}
        onSubmit={onAddTenant}
      />
      <WrapperTemplate>
        <BuildingWrapper className="isomorphicNoteComponent">
          <div style={{ width: "320px" }} className="isoNoteListSidebar">
            <SideList
              items={buildings}
              resetId={condominium.id!}
              filterKeys={["name"]}
            >
              {(building: Building) => {
                const activeClass = selected.id === building.id ? "active" : "";
                return (
                  <div
                    className={`isoList ${activeClass}`}
                    key={building.id}
                    onClick={onSelectBuilding(building)}
                  >
                    <div className="isoNoteBGColor" style={{ width: "5px" }} />
                    <div className="isoNoteText">
                      <h3>{"Edificio " + building.name}</h3>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div className="isoNoteText">
                      <Icon
                        type="edit"
                        style={{ fontSize: 20 }}
                        onClick={() => onOpenBuilding(building)()}
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
                onClick={onOpenBuilding({ condominiumId: condominium.id })}
              >
                Crear Edificio
              </Button>
              {selected.id && (
                <Button
                  onClick={onOpenApartment({ buildingId: selected.id })}
                  type="primary"
                  className="isoAddNoteBtn"
                  style={{ marginLeft: "0.5rem" }}
                >
                  Crear Apartamento
                </Button>
              )}
            </Layout.Header>
            {selected.id && (
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
                    {"Edificio " + selected.name}
                  </h2>
                </div>
                <Scrollbar>
                  <ApartmentView
                    buildingId={selected.id!}
                    onEditApartment={apartment => onOpenApartment(apartment)()}
                    onAddTenant={onOpenTenant}
                  />
                </Scrollbar>
              </Layout.Content>
            )}
          </Layout>
        </BuildingWrapper>
      </WrapperTemplate>
    </>
  );
}
