import React, { useState, useEffect } from "react";
import AntdModal from "../../atoms/modal";
import Input, { InputArea } from "../../atoms/input";
import Form from "../../atoms/form";
import Row from "../../atoms/row";
import Modals from "./modal.style";
import withDirection from "../../hoc/with-direction";
import { Ticket } from "../../../shared-ui/models/ticket.model";
import FormItem from "../../molecules/form-item";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

export interface ITicketCreateForm {
  visible?: boolean;
  onClose?(): void;
  onCreate?(ticket: Ticket): void;
}

export default function TicketCreateForm(props: ITicketCreateForm) {
  const { visible, onCreate, onClose } = props;
  const [form, setForm] = useState<Ticket>({});
  const handleChange = (event: any) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  useEffect(() => {
    if (!visible) setForm({});
  }, [visible]);

  return (
    <Modal
      onCancel={onClose}
      onOk={() => onCreate!(form)}
      visible={visible}
      cancelText="Cancelar"
      okText="Crear Ticket"
      title="Crear Ticket"
    >
      <Form className="isoCardInfoForm">
        <Row>
          <FormItem label="Título" sm={24} md={24}>
            <Input
              placeholder="Título"
              type="text"
              className={`isoCardInput`}
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </FormItem>
          <FormItem label="Descripción" sm={24} md={24}>
            <InputArea
              placeholder="Descripción del problema"
              className="isoCardInput"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </FormItem>
        </Row>
      </Form>
    </Modal>
  );
}
