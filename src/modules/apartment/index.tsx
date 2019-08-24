import React, { useEffect } from "react";

import { Card, Icon } from "antd";

import Table, { Column } from "../../components/atoms/table";
import Col from "../../components/atoms/col";
import Button, { ButtonGroup } from "../../components/atoms/button";
import PopConfirm from "../../components/atoms/pop-confirm";
import ApartmentForm from "../../components/organisisms/apartment-form";
import BladeTemplate from "../../components/templates/blade-template";

import { select } from "../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { buildingSelector } from "../../shared-ui/store/selectors/building";
import { apartmentSelector } from "../../shared-ui/store/selectors/apartment";
import {
  setApartmentAction,
  createApartmentAction,
  updateApartmentAction,
  refreshApartmentsAction
} from "../../shared-ui/store/actions/apartment";
import { serviceSelector } from "../../shared-ui/store/selectors/service.selector";
import { loadServicesAction } from "../../shared-ui/store/actions/service.action";
import { Apartment } from "../../shared-ui/models/apartment";
import useSearch from "../../components/hooks/use-table-search";
import ColumnInputFilter from "../../components/molecules/column-input-filter";
import ColumnSelectFilter from "../../components/molecules/column-select-filter";

const buildingState = select(buildingSelector);
const apartmentState = select(apartmentSelector);
const serviceState = select(serviceSelector);

export interface IApartment {
  buildingId: number;
  onEditApartment(apartment: Apartment): void;
  onDeleteApartment(apartment: Apartment): void;
}

export default function ApartmentView({
  buildingId,
  onEditApartment,
  onDeleteApartment
}: IApartment) {
  const apartments = useReduxState(apartmentState("apartments"));
  const { onFilter, handleSearch, handleReset } = useSearch();

  const create = useReduxAction(createApartmentAction());
  const update = useReduxAction(updateApartmentAction());
  const loadApartment = useReduxAction(refreshApartmentsAction());

  useEffect(() => {
    const payload = { buildingId: buildingId, deprecated: false };
    loadApartment(payload);
  }, [buildingId]);

  return (
    <div>
      <Table
        dataSource={apartments}
        rowKey="id"
        pagination={{ pageSize: 5, showSizeChanger: true }}
        className="invoiceListTable"
      >
        <Column
          title="ID"
          dataIndex="id"
          width="80px"
          onFilter={onFilter(record => record.id)}
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
          title="Identificador"
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
          title="Piso"
          dataIndex="floor"
          width="80px"
          onFilter={onFilter(record => record.floor)}
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
          title="Área (mt2)"
          dataIndex="mt2"
          width="80px"
          render={(text: string) => <span>{text}</span>}
        />
        <Column
          title="Plan"
          dataIndex="mt2"
          width="80px"
          render={(_: string, apartment: Apartment) => (
            <span>{apartment.service ? apartment.service!.name : ""}</span>
          )}
        />
        <Column
          title="Parqueos"
          dataIndex="parkingLots"
          width="80px"
          onFilter={onFilter(record => record.parkingLots)}
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
          title="Acciones"
          dataIndex="edit"
          width="80px"
          render={(_: string, apartment: Apartment) => (
            <ButtonGroup>
              <Button
                type="primary"
                icon="edit"
                onClick={() => onEditApartment(apartment)}
              />
              <PopConfirm
                title="Esta seguro de eliminar este apartamento?"
                onConfirm={() => onDeleteApartment(apartment)}
              >
                <Button type="danger" size="default" icon="close" />
              </PopConfirm>
            </ButtonGroup>
          )}
        />
      </Table>
    </div>
  );
}

function Information({ name, title, children }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {title + ": "} <strong>{name}</strong>
      {children}
    </div>
  );
}
