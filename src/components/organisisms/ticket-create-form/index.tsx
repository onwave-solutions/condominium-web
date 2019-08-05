import React, { useState, useEffect } from "react";
import AntdModal from "../../atoms/modal";
import Input, { InputArea } from "../../atoms/input";
import Checkbox from "../../atoms/checkbox";
import Form from "../../atoms/form";
import Row from "../../atoms/row";
import Modals from "./modal.style";
import withDirection from "../../hoc/with-direction";
import { Ticket } from "../../../shared-ui/models/ticket.model";
import FormItem from "../../molecules/form-item";
import BuildingTree from "..//building-tree";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

export interface ITicketCreateForm {
  visible?: boolean;
  onClose?(): void;
  buildingId?: number;
  condominiumId?: number;
  isTenant?: boolean;
  onCreate?(ticket: Ticket): void;
}

export default function TicketCreateForm(props: ITicketCreateForm) {
  const {
    visible,
    onCreate,
    condominiumId,
    isTenant,
    buildingId,
    onClose
  } = props;
  const [form, setForm] = useState<Ticket>({ apartmentKeys: [] });
  const handleChange = (event: any) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  useEffect(() => {
    if (!visible) setForm({ apartmentKeys: [] });
  }, [visible]);

  return (
    <Modal
      onCancel={onClose}
      onOk={() => onCreate!(form)}
      okButtonProps={{
        disabled:
          !form.title ||
          !form.description ||
          (!isTenant && !form.apartmentKeys!.length)
      }}
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
          {!isTenant && condominiumId && (
            <FormItem sm={24} md={24} label="Apartamento afectados">
              <BuildingTree
                condominiumId={condominiumId}
                selectedKeys={form.apartmentKeys || []}
                setSelectedKeys={apartmentKeys =>
                  setForm({ ...form, apartmentKeys })
                }
              />
            </FormItem>
          )}
          {isTenant && (
            <Checkbox
              onChange={({ target: { checked } }) => {
                setForm({
                  ...form,
                  apartmentKeys: checked ? [`${buildingId}`] : []
                });
              }}
            >
              Este problema afecta al edificio completo
            </Checkbox>
          )}
        </Row>
      </Form>
    </Modal>
  );
}
