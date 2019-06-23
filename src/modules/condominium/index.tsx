import React, { useEffect, useState } from "react";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AgGridReact } from "ag-grid-react";

import Modal from "../../components/atoms/modal";
import Row from "../../components/atoms/row";

import Scrollbar from "../../components/atoms/scrollbar";
import Table, { Column } from "../../components/atoms/table";
import { Wrapper } from "../../components/atoms/body-wrapper";

import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
import CondominiumForm from "../../components/organisisms/condominium-form";
import BladeTemplate from "../../components/templates/blade-template";

import { select } from "../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { condominiumSelector } from "../../shared-ui/store/selectors/condominium";
import {
  setCondominiumAction,
  createCondominiumAction,
  updateCondominiumAction,
  refreshCondominiumsAction
} from "../../shared-ui/store/actions/condominium.action";

import { addChildBlade } from "../../shared-ui/store/actions/app";
import { IModule } from "../../shared-ui/models/module";
import { Condominium } from "../../shared-ui/models/condominium";

const columns: ColDef[] = [
  {
    field: "name",
    headerName: "Nombre"
  },
  {
    field: "address",
    headerName: "Dirección"
  }
];

const condominiumState = select(condominiumSelector);

export default function CondominiumBlade(props: IModule) {
  const [visible, setVisibility] = useState<boolean>(false);
  const condominium = useReduxState(condominiumState("condominium"));
  const condominiums = useReduxState(condominiumState("condominiums"));

  const setCondominium = useReduxAction(setCondominiumAction);
  const create = useReduxAction(createCondominiumAction());
  const update = useReduxAction(updateCondominiumAction());
  const loadCondominium = useReduxAction(refreshCondominiumsAction());

  const clear = () => {
    setCondominium({});
  };

  useEffect(() => {
    loadCondominium();
    return () => {
      clear();
    };
  }, []);

  const handleOpenModal = (condominium: Condominium) => () => {
    setCondominium(condominium);
    setVisibility(true);
  };

  const handleAction = async () => {
    if (condominium.id) {
      await update(condominium);
    } else {
      await create(condominium);
    }
    setVisibility(false);
  };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={() => setVisibility(false)}
        onOk={handleAction}
        closable={false}
        title={`${condominium.id ? "Actualizar" : "Crear"} Condominio`}
      >
        <Row>
          <CondominiumForm
            condominium={condominium}
            condominiumChanged={setCondominium}
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
            <Table
              dataSource={condominiums}
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
                title="Dirección"
                dataIndex="address"
                width="80px"
                render={(text: string) => <span>{text}</span>}
              />
              <Column
                title="Editar"
                dataIndex={"edit"}
                width={"5%"}
                render={(_: string, condominium: Condominium) => (
                  <>
                    <Button
                      onClick={handleOpenModal(condominium)}
                      icon="edit"
                    />
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
