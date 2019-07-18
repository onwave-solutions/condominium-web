import React, { useEffect } from "react";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";

import { Card, Icon } from "antd";

import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";
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

const buildingState = select(buildingSelector);
const apartmentState = select(apartmentSelector);
const serviceState = select(serviceSelector);

export interface IApartment {
  buildingId: number;
  onEditApartment(apartment: Apartment): void;
}

export default function ApartmentView({
  buildingId,
  onEditApartment
}: IApartment) {
  const apartments = useReduxState(apartmentState("apartments"));

  const create = useReduxAction(createApartmentAction());
  const update = useReduxAction(updateApartmentAction());
  const loadApartment = useReduxAction(refreshApartmentsAction());

  useEffect(() => {
    const payload = { buildingId: buildingId };
    loadApartment(payload);
  }, [buildingId]);

  return (
    <div>
      {apartments && apartments.length
        ? apartments.map(apartment => {
            return (
              <Card
                key={apartment.id}
                style={{
                  marginBottom: "1rem"
                }}
                title={"Apartamento " + apartment.name}
                actions={[
                  <Icon
                    type="edit"
                    onClick={() => onEditApartment(apartment)}
                  />
                ]}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Information title={"Piso"} name={apartment.floor} />
                  <Information title={"Área (mts2)"} name={apartment.mt2} />
                  <Information title={"Plan"} name={apartment.service!.name} />
                  <Information
                    title={"Parqueos"}
                    name={apartment.parkingLots!}
                  />
                </div>
              </Card>
            );
          })
        : null}
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
