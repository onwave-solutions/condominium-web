import React, { useState, useEffect } from "react";

import { Rifm } from "rifm";
import AntdModal from "../../atoms/modal";
import Form from "../../atoms/form";
import Row from "../../atoms/row";
import Select from "../../atoms/select";
import Modals from "../../hoc/with-modal-style";
import withDirection from "../../hoc/with-direction";
import FormItem from "../../molecules/form-item";
import Input from "../../atoms/input";
import { Supplier } from "../../../shared-ui/models/supplier.model";
import { Keylist } from "../../../shared-ui/models/keylist";
import Checkbox from "../../atoms/checkbox";
import { identificationFormat } from "../../../shared-ui/utils/input";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

export interface ISupplierForm {
  visible?: boolean;
  onClose?(): void;
  keylist: Keylist;
  form: Supplier;
  setForm: (supplier: Supplier) => void;
  onAction?(supplier: Supplier): void;
}

export default function SupplierForm({
  visible,
  onClose,
  keylist,
  onAction,
  form,
  setForm
}: ISupplierForm) {
  const handleChange = (event: any) =>
    setForm!({ ...form, [event.target.name]: event.target.value });

  const onItemSelect = (name: string, value: any) => {
    setForm!({ ...form, [name]: value });
  };

  useEffect(() => {
    if (!visible) setForm({});
  }, [visible]);

  const formatID = identificationFormat(form!.documentId);

  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      onOk={() => onAction!(form)}
      cancelText="Cancelar"
      okText={!form.id ? "Crear Suplidor" : "Editar Suplidor"}
      title={!form.id ? "Crear Suplidor" : "Editar Suplidor"}
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
          <FormItem label="Tipo de documento">
            <Select
              name="documentId"
              onChangeItem={onItemSelect}
              value={form!.documentId}
              data={keylist!.documentTypes}
            />
          </FormItem>
          <FormItem label="Documento">
            <Rifm
              value={form!.document!}
              format={formatID}
              accept={/\d+/g}
              onChange={value => onItemSelect("document", value)}
            >
              {({ value, onChange }) => (
                <Input name="document" value={value} onChange={onChange} />
              )}
            </Rifm>
          </FormItem>
        </Form>
      </Row>
    </Modal>
  );
}
