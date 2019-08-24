import React, { useEffect, useState } from "react";

import Modal from "../../components/atoms/modal";
import PopConfirm from "../../components/atoms/pop-confirm";
import Row from "../../components/atoms/row";

import Scrollbar from "../../components/atoms/scrollbar";
import Table, { Column } from "../../components/atoms/table";
import { Wrapper } from "../../components/atoms/body-wrapper";

import Col from "../../components/atoms/col";
import Button, { ButtonGroup } from "../../components/atoms/button";
import CondominiumForm from "../../components/organisisms/condominium-form";
import BladeTemplate from "../../components/templates/blade-template";

import { select } from "../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { condominiumSelector } from "../../shared-ui/store/selectors/condominium";
import {
  setCondominiumAction,
  createCondominiumAction,
  updateCondominiumAction,
  refreshCondominiumsAction,
  deleteCondominiumAction
} from "../../shared-ui/store/actions/condominium.action";

import { addChildBlade } from "../../shared-ui/store/actions/app";
import { IModule } from "../../shared-ui/models/module";
import { Condominium } from "../../shared-ui/models/condominium";
import useSearch from "../../components/hooks/use-table-search";
import ColumnInputFilter from "../../components/molecules/column-input-filter";
import ColumnSelectFilter from "../../components/molecules/column-select-filter";

const condominiumState = select(condominiumSelector);

export default function CondominiumBlade(props: IModule) {
  const { onFilter, handleSearch, handleReset } = useSearch();
  const [visible, setVisibility] = useState<boolean>(false);
  const condominium = useReduxState(condominiumState("condominium"));
  const condominiums = useReduxState(condominiumState("condominiums"));

  const setCondominium = useReduxAction(setCondominiumAction);
  const create = useReduxAction(createCondominiumAction());
  const update = useReduxAction(updateCondominiumAction());
  const onDelete = useReduxAction(deleteCondominiumAction);
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
    const cb = () => setVisibility(false);
    if (condominium.id) {
      await update(condominium, cb);
    } else {
      await create(condominium, cb);
    }
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
                title="Moneda"
                dataIndex="currencySymbol"
                onFilter={onFilter(record => record.currencySymbol)}
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
                title="Dirección"
                dataIndex="address"
                width="80px"
                onFilter={onFilter(record => record.address)}
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
                title="Edificios"
                dataIndex={"buildings"}
                width={"5%"}
                render={(_: string, condominium: Condominium) => (
                  <>
                    <Button
                      onClick={() =>
                        props.history.push(`/building/${condominium.id}`)
                      }
                      icon="eye"
                    />
                  </>
                )}
              />
              <Column
                title="Editar"
                dataIndex={"edit"}
                width={"5%"}
                render={(_: string, condominium: Condominium) => (
                  <ButtonGroup>
                    <Button
                      type="primary"
                      onClick={handleOpenModal(condominium)}
                      icon="edit"
                    />
                    <PopConfirm
                      title="Esta seguro de eliminar este condominio?"
                      onConfirm={() => onDelete(condominium)}
                    >
                      <Button type="danger" icon="delete" />
                    </PopConfirm>
                  </ButtonGroup>
                )}
              />
            </Table>
          </Scrollbar>
        </Wrapper>
      </BladeTemplate>
    </>
  );
}
