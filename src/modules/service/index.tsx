import React, { useEffect, useState } from "react";

import Table, { Column } from "../../components/atoms/table";
import Scrollbar from "../../components/atoms/scrollbar";
import Button, { ButtonGroup } from "../../components/atoms/button";
import PopConfirm from "../../components/atoms/pop-confirm";
import Modal from "../../components/atoms/modal";
import Row from "../../components/atoms/row";
import { IModule } from "../../shared-ui/models/module";
import BladeTemplate from "../../components/templates/blade-template";
import ServiceForm from "../../components/organisisms/service-form";
import { select } from "../../shared-ui/store/selectors";
import { serviceSelector } from "../../shared-ui/store/selectors/service.selector";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import {
  setServiceAction,
  loadServicesAction,
  createServiceAction,
  updateServiceAction,
  bulkAssignServiceAction,
  deleteServiceAction
} from "../../shared-ui/store/actions/service.action";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { Wrapper } from "../../components/atoms/body-wrapper";
import { Service } from "../../shared-ui/models/service.model";
import { appSelector } from "../../shared-ui/store/selectors/app";
import BuildingTreeModal from "../../components/organisisms/building-tree-form";
import { currencyFormat } from "../../shared-ui/utils/currency";

const serviceState = select(serviceSelector);
const managerState = select(managerSelector);
const appState = select(appSelector);

export default function ServiceView(props: IModule) {
  const keylist = useReduxState(appState("keylist"));
  const [selectModal, setSelectModal] = useState<number>(0);
  const [serviceModal, setServiceModal] = useState<boolean>(false);
  const service = useReduxState(serviceState("service"));
  const services = useReduxState(serviceState("services"));
  const condominium = useReduxState(managerState("condominium"));

  const setService = useReduxAction(setServiceAction);
  const loadServices = useReduxAction(loadServicesAction(props.id));
  const create = useReduxAction(createServiceAction(props.id));
  const update = useReduxAction(updateServiceAction(props.id));
  const onDelete = useReduxAction(deleteServiceAction);
  const bulk = useReduxAction(bulkAssignServiceAction(props.id));

  const formatter = currencyFormat(condominium);

  const handleAction = async () => {
    const cb = () => setServiceModal(false)
    if (service.id) {
      await update(service, cb);
    } else {
      await create(service, cb);
    }
  };

  useEffect(() => {
    if (condominium.id === service.condominiumId) return;
    const payload: Service = {
      condominiumId: condominium.id,
      deprecated: false
    };
    setService(payload);
    loadServices(payload);
  }, [condominium.id]);

  const handleOpenService = (service: Service) => () => {
    setService(service);
    setServiceModal(true);
  };

  const handleOpenSelect = (service: Service) => () => {
    setSelectModal(service.id!);
  };

  const handleBulk = (service: Service) => async (newService: Service) => {
    setSelectModal(0);
    await bulk({
      ...service,
      apartmentKeys: newService.apartmentKeys
    });
  };

  return (
    <>
      <Modal
        visible={serviceModal}
        onCancel={() => setServiceModal(false)}
        onOk={handleAction}
        closable={false}
        title={`${service.id ? "Actualizar" : "Crear"} Servicio`}
      >
        <Row>
          <ServiceForm
            service={service}
            serviceChanged={setService}
            keylist={keylist}
          />
        </Row>
      </Modal>
      <BladeTemplate
        header={
          <>
            {
              <Button
                type="primary"
                onClick={handleOpenService({ condominiumId: condominium.id })}
              >
                Crear
              </Button>
            }
          </>
        }
      >
        <Wrapper>
          <div className="isoInvoiceTable">
            <Scrollbar style={{ width: "100%" }}>
              <Table
                dataSource={services}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              >
                <Column
                  title="Nombre"
                  dataIndex="name"
                  width="80px"
                  render={(text: string) => <span>{text}</span>}
                />
                <Column
                  title="Descripción"
                  dataIndex="description"
                  width="80px"
                  render={(text: string) => <span>{text}</span>}
                />
                <Column
                  title="Tipo de Tasación"
                  dataIndex="serviceType"
                  width="80px"
                  render={(_: string, service: Service) => (
                    <span>{service.serviceTypeRaw!.name}</span>
                  )}
                />
                <Column
                  title="Día de Corte"
                  dataIndex="cutoffDay"
                  width="80px"
                  render={(text: string) => <span>{text}</span>}
                />
                <Column
                  title="Día de pago"
                  dataIndex="dueDay"
                  width="80px"
                  render={(text: string) => <span>{text}</span>}
                />
                <Column
                  title="Monto"
                  dataIndex="amount"
                  width="80px"
                  render={(text: number) => <span>{formatter(text)} </span>}
                />
                <Column
                  title="Mora"
                  dataIndex="lateFee"
                  width="80px"
                  render={(_: string, service: Service) => (
                    <span>
                      {service.lateFee! + (service.percent ? "%" : "")}
                    </span>
                  )}
                />

                <Column
                  title="Asignar a"
                  dataIndex={"asign"}
                  width={"5%"}
                  render={(_: string, service: Service) => (
                    <>
                      <Button
                        type="primary"
                        onClick={handleOpenSelect(service)}
                        icon="api"
                      />

                      <BuildingTreeModal
                        onAction={handleBulk(service)}
                        visible={selectModal === service.id}
                        condominiumId={condominium.id}
                        onClose={() => setSelectModal(0)}
                      />
                    </>
                  )}
                />

                <Column
                  title="Acciones"
                  dataIndex={"edit"}
                  width={"5%"}
                  render={(_: string, service: Service) => (
                    <ButtonGroup>
                      <Button
                        onClick={handleOpenService(service)}
                        icon="edit"
                      />
                      <PopConfirm
                        title="Esta seguro de eliminar este plan?"
                        onConfirm={() => onDelete(service)}
                      >
                        <Button type="danger" icon="delete" />
                      </PopConfirm>
                    </ButtonGroup>
                  )}
                />
              </Table>
            </Scrollbar>
          </div>
        </Wrapper>
      </BladeTemplate>
    </>
  );
}
