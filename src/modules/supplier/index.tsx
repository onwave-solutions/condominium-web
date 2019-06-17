import React, { useState, useEffect } from "react";
import { IModule } from "../../shared-ui/models/module";
import BladeTemplate from "../../components/templates/blade-template";
import Table, { Column } from "../../components/atoms/table";
import Button from "../../components/atoms/button";
import SupplierModal from "../../components/organisisms/supplier-create-form";
import { select } from "../../shared-ui/store/selectors";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { supplierSelector } from "../../shared-ui/store/selectors/supplier.selector";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import {
  loadSuppliersAction,
  createSupplierAction
} from "../../shared-ui/store/actions/supplier.action";
import { Supplier } from "../../shared-ui/models/supplier.model";

const managerState = select(managerSelector);
const supplierState = select(supplierSelector);

export default function SupplierView(props: IModule) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const condominium = useReduxState(managerState("condominium"));
  const suppliers = useReduxState(supplierState("suppliers"));

  const loadSupplierList = useReduxAction(loadSuppliersAction(props.id));
  const createSupplier = useReduxAction(createSupplierAction(props.id));
  const handleLoadSuppliers = () =>
    loadSupplierList({ condominiumId: condominium.id });

  const handleModalVisibility = (status: boolean) => {
    return () => setModalVisible(status);
  };

  const onCreateSupplier = (supplier: Supplier) => {
    createSupplier({ ...supplier, condominiumId: condominium.id });
    setModalVisible(false);
  };

  useEffect(() => {
    handleLoadSuppliers();
  }, [condominium.id]);

  return (
    <>
      <BladeTemplate
        header={
          <>
            <Button onClick={handleModalVisibility(true)} type="primary">
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
                <>
                  <Button
                    shape="circle"
                    className="invoiceDltBtn"
                    type="primary"
                    size="default"
                    icon="edit"
                  />
                </>
              );
            }}
          />
        </Table>
      </BladeTemplate>
      <SupplierModal
        visible={modalVisible}
        onAction={onCreateSupplier}
        onClose={handleModalVisibility(false)}
      />
    </>
  );
}
