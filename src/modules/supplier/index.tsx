import React, { useState, useEffect } from "react";
import { IModule } from "../../shared-ui/models/module";
import BladeTemplate from "../../components/templates/blade-template";
import Table, { Column } from "../../components/atoms/table";
import Button, { ButtonGroup } from "../../components/atoms/button";
import PopConfirm from "../../components/atoms/pop-confirm";
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
import useSearch from "../../components/hooks/use-table-search";
import ColumnInputFilter from "../../components/molecules/column-input-filter";
import ColumnSelectFilter from "../../components/molecules/column-select-filter";
import { identificationFormat } from "../../shared-ui/utils/input";

const managerState = select(managerSelector);
const supplierState = select(supplierSelector);
const appState = select(appSelector);

export default function SupplierView(props: IModule) {
  const { onFilter, handleSearch, handleReset } = useSearch();
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
    loadSupplierList({ condominiumId: condominium.id, disabled: false });

  const handleModalVisibility = (status: boolean) => {
    return () => setModalVisible(status);
  };

  const onAction = (supplier: Supplier) => {
    const cb = () => setModalVisible(false);
    if (supplier.id) {
      updateSupplier({ ...supplier, condominiumId: condominium.id }, cb);
    } else {
      createSupplier({ ...supplier, condominiumId: condominium.id }, cb);
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
            onFilter={onFilter(record => record.description)}
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
            title="Tipo de Documento"
            dataIndex="documentId"
            filterDropdown={(filterProps: any) => (
              <ColumnSelectFilter
                {...filterProps}
                data={keylist.documentTypes}
                handleSearch={handleSearch}
                handleReset={handleReset}
              />
            )}
            onFilter={onFilter(record => record.documentId || "")}
            render={(_: string, supplier: Supplier) => (
              <span>
                {supplier.documentType ? supplier.documentType!.name : ""}
              </span>
            )}
          />
          <Column
            title="Documento"
            dataIndex="document"
            onFilter={onFilter(record => record.document)}
            filterDropdown={(filterProps: any) => (
              <ColumnInputFilter
                {...filterProps}
                handleSearch={handleSearch}
                handleReset={handleReset}
              />
            )}
            render={(_: string, supplier: Supplier) => {
              const formatID = identificationFormat(supplier.documentId);
              return <span>{formatID(supplier.document)}</span>;
            }}
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
                    <PopConfirm
                      title="Desea activar este suplidor?"
                      onConfirm={() =>
                        onAction({ ...supplier, disabled: false })
                      }
                    >
                      <Button type="default" size="default" icon="check" />
                    </PopConfirm>
                  ) : (
                    <PopConfirm
                      title="Desea Inhabilitar este suplidor?"
                      onConfirm={() =>
                        onAction({ ...supplier, disabled: true })
                      }
                    >
                      <Button type="danger" size="default" icon="close" />
                    </PopConfirm>
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
