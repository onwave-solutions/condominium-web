import React, { useState, useEffect } from "react";

import AntdModal from "../../atoms/modal";
import Form from "../../atoms/form";
import Row from "../../atoms/row";
import Modals from "../../hoc/with-modal-style";
import withDirection from "../../hoc/with-direction";
import FormItem from "../../molecules/form-item";
import Input from "../../atoms/input";
import { Supplier } from "../../../shared-ui/models/supplier.model";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

export interface ISupplierForm {
  visible?: boolean;
  onClose?(): void;
  onAction?(supplier: Supplier): void;
}

export default function SupplierForm({
  visible,
  onClose,
  onAction
}: ISupplierForm) {
  const [form, setForm] = useState<Supplier>({});
  const handleChange = (event: any) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  useEffect(() => {
    if (!visible) setForm({});
  }, [visible]);
  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      onOk={() => onAction!(form)}
      cancelText="Cancelar"
      okText="Crear Suplidor"
      title="Crear Suplidor"
    >
      <Row>
        <Form className="isoCardInfoForm">
          <FormItem label="Suplidor" sm={24} md={24}>
            <Input
              placeholder="Suplidor"
              type="text"
              className={`isoCardInput`}
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </FormItem>
        </Form>
      </Row>
    </Modal>
  );
}
