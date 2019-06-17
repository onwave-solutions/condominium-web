import React, { useState, useEffect } from "react";

import AntdModal from "../../atoms/modal";
import Row from "../../atoms/row";
import Modals from "../../hoc/with-modal-style";
import Form from "../../atoms/form";
import Select from "../../atoms/select";
import FormItem from "../../molecules/form-item";
import withDirection from "../../hoc/with-direction";
import { Building } from "../../../shared-ui/models/building";
import { Apartment } from "../../../shared-ui/models/apartment";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

export interface IApartmentSelect {
  visible?: boolean;
  onClose?(): void;
  condominiumId?: number;
  onAction?(apartmentId: number): void;
  getBuildings?(condominiumId: number): Promise<Building[]>;
  getApartments?(buildingId: number): Promise<Apartment[]>;
}

export default function ApartmentSelect({
  onClose,
  visible,
  condominiumId,
  onAction,
  getBuildings,
  getApartments
}: IApartmentSelect) {
  const [building, setBuilding] = useState<number | undefined>();
  const [apartment, setApartment] = useState<number | undefined>();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [apartments, setApartments] = useState<Building[]>([]);

  useEffect(() => {
    if (!getBuildings) return;
    getBuildings(condominiumId!).then(setBuildings);
  }, [condominiumId]);

  useEffect(() => {
    if (visible) return;
    setBuilding(undefined);
  }, [visible]);

  useEffect(() => {
    setApartments([]);
    setApartment(undefined);
    if (!getApartments || !building) return;
    getApartments(building).then(setApartments);
  }, [building]);

  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      onOk={() => apartment && onAction!(apartment)}
      cancelText="Cancelar"
      okText="Asignar Apartamento"
      title="Asignar Apartamento"
    >
      <Row>
        <FormItem label="Edificio" sm={24} md={24}>
          <Select
            name="building"
            typeName="id"
            labelName="name"
            onChange={value => {
              setBuilding(value as number)
            }}
            value={building}
            data={buildings}
          />
        </FormItem>
        <FormItem label="Apartamento" sm={24} md={24}>
          <Select
            name="building"
            typeName="id"
            labelName="name"
            onChange={value => setApartment(value as number)}
            value={apartment}
            data={apartments}
          />
        </FormItem>
      </Row>
    </Modal>
  );
}
