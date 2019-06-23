import React from "react";
import Modal from "../../atoms/modal";
import Row from "../../atoms/row";

export type ICreationModal = {
  visible: boolean;
  onCancel?(): void;
  onOk?(): void;
  children?: React.ReactChildren;
  title?: string;
};

export default function CreationModal({
  visible,
  onCancel,
  onOk,
  title,
  children
}: ICreationModal) {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      title={title}
      closable={false}
    >
      <Row>{children}</Row>
    </Modal>
  );
}
