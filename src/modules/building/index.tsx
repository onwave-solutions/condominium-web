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
  refreshBuildingsAction,
  findCondominiumByIdAction
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
  const { match } = props;

  const [building, setBuilding] = useState<Building>({});
  const [apartmentModal, setApartmentModal] = useState<boolean>(false);
  const [buildingModal, setBuildingModal] = useState<boolean>(false);
  const selected = useReduxState(buildingState("building"));
  const condominium = useReduxState(buildingState("condominium"));
  const apartment = useReduxState(apartmentState("apartment"));
  const services = useReduxState(serviceState("services"));
  const buildings = useReduxState(buildingState("buildings"));

  const create = useReduxAction(createBuildingAction());
  const update = useReduxAction(updateBuildingAction());
  const createApartment = useReduxAction(createApartmentAction());
  const updateApartment = useReduxAction(updateApartmentAction());
  const findCondominium = useReduxAction(findCondominiumByIdAction);

  const loadBuilding = useReduxAction(refreshBuildingsAction());
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

  useEffect(() => {
    if (match && match.params && match.params.id) {
      findCondominium(match.params.id);
    }
  }, []);

  useEffect(() => {
    if (condominium.id === selected.condominiumId) return;
    const payload = { condominiumId: condominium.id };
    setSelected(payload);
    loadBuilding(payload);
    loadServices(payload);
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
                <>
                  <Button
                    onClick={onOpenBuilding(selected)}
                    type="primary"
                    className="isoAddNoteBtn"
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Editar Edificio
                  </Button>
                  <Button
                    onClick={onOpenApartment({ buildingId: selected.id })}
                    type="primary"
                    className="isoAddNoteBtn"
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Crear Apartamento
                  </Button>
                </>
              )}
            </Layout.Header>
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
                <h2>{condominium.name} </h2>
                {selected.id && (
                  <h2 style={{ marginRight: "0.7rem" }}>
                    {"Edificio " + selected.name}
                  </h2>
                )}
              </div>
              {selected.id && (
                <Scrollbar>
                  <ApartmentView
                    buildingId={selected.id!}
                    onEditApartment={apartment => onOpenApartment(apartment)()}
                  />
                </Scrollbar>
              )}
            </Layout.Content>
          </Layout>
        </BuildingWrapper>
      </WrapperTemplate>
    </>
  );
}
