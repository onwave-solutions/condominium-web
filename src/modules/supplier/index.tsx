import React, { useState, useEffect } from "react";
import { IModule } from "../../shared-ui/models/module";
import BladeTemplate from "../../components/templates/blade-template";
import Table, { Column } from "../../components/atoms/table";
import Button, { ButtonGroup } from "../../components/atoms/button";
import SupplierModal from "../../components/organisisms/supplier-create-form";
import { select } from "../../shared-ui/store/selectors";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { supplierSelector } from "../../shared-ui/store/selectors/supplier.selector";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import {
  loadSuppliersAction,
  createSupplierAction,
  updateSupplierAction,
  setSupplierAction
} from "../../shared-ui/store/actions/supplier.action";
import { Supplier } from "../../shared-ui/models/supplier.model";
import { appSelector } from "../../shared-ui/store/selectors/app";

const managerState = select(managerSelector);
const supplierState = select(supplierSelector);
const appState = select(appSelector);

export default function SupplierView(props: IModule) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const condominium = useReduxState(managerState("condominium"));
  const suppliers = useReduxState(supplierState("suppliers"));
  const supplier = useReduxState(supplierState("supplier"));
  const keylist = useReduxState(appState("keylist"));

  const loadSupplierList = useReduxAction(loadSuppliersAction(props.id));
  const setSupplier = useReduxAction(setSupplierAction);
  const createSupplier = useReduxAction(createSupplierAction(props.id));
  const updateSupplier = useReduxAction(updateSupplierAction(props.id));
  const handleLoadSuppliers = () =>
    loadSupplierList({ condominiumId: condominium.id });

  const handleModalVisibility = (status: boolean) => {
    return () => setModalVisible(status);
  };

  const onAction = (supplier: Supplier) => {
    if (supplier.id) {
      updateSupplier({ ...supplier, condominiumId: condominium.id });
      setModalVisible(false);
    } else {
      createSupplier({ ...supplier, condominiumId: condominium.id });
      setModalVisible(false);
    }
  };

  const onCreateSupplier = () => {
    setSupplier({});
    setModalVisible(true);
  };

  const onUpdateSupplier = (supplier: Supplier) => () => {
    setSupplier(supplier);
    setModalVisible(true);
  };

  useEffect(() => {
    handleLoadSuppliers();
  }, [condominium.id]);

  return (
    <>
      <BladeTemplate
        header={
          <>
            <div style={{ flex: 1 }} />
            <Button onClick={onCreateSupplier} type="primary">
              Crear Suplidor
            </Button>
          </>
        }
      >
        <Table dataSource={suppliers} rowKey="id" pagination={false}>
          <Column
            title="Suplidor"
            dataIndex="description"
            render={(text: string) => <span>{text}</span>}
          />
          <Column
            title="Tipo de Documento"
            dataIndex="documentId"
            render={(_: string, supplier: Supplier) => (
              <span>{supplier.documentId}</span>
            )}
          />
          <Column
            title="Documento"
            dataIndex="document"
            render={(text: string) => <span>{text}</span>}
          />
          <Column
            title="Habilitado"
            dataIndex="disabled"
            width="100px"
            render={(_: string, supplier: Supplier) => (
              <span>{!supplier.disabled ? "Si" : "No"}</span>
            )}
          />
          <Column
            title={"Acciones"}
            dataIndex={"view"}
            width={"150px"}
            render={(_: string, supplier: Supplier) => {
              return (
                <ButtonGroup>
                  <Button
                    className="invoiceDltBtn"
                    onClick={onUpdateSupplier(supplier)}
                    type="primary"
                    size="default"
                    icon="edit"
                  />
                  {supplier.disabled ? (
                    <Button
                      onClick={() => onAction({ ...supplier, disabled: false })}
                      type="default"
                      size="default"
                      icon="check"
                    />
                  ) : (
                    <Button
                      onClick={() => onAction({ ...supplier, disabled: true })}
                      type="danger"
                      size="default"
                      icon="close"
                    />
                  )}
                </ButtonGroup>
              );
            }}
          />
        </Table>
      </BladeTemplate>
      <SupplierModal
        form={supplier}
        setForm={setSupplier}
        visible={modalVisible}
        keylist={keylist}
        onAction={onAction}
        onClose={handleModalVisibility(false)}
      />
    </>
  );
}
