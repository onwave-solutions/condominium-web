import React from "react";
import Modal from "../../atoms/modal";
import Row from "../../atoms/row";
import ApartmentForm, { IApartmentForm } from "../apartment-form";

export type IApartmentModal = {
  visible: boolean;
  onCancel?(): void;
  onOk?(): void;
} & IApartmentForm;

export default function ApartmentModal({
  visible,
  onCancel,
  onOk,
  ...props
}: IApartmentModal) {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      title={(props.apartment.id ? "Editar " : "Crear ") + "Apartamento"}
      closable={false}
    >
      <Row>
        <ApartmentForm {...props} />
      </Row>
    </Modal>
  );
}
