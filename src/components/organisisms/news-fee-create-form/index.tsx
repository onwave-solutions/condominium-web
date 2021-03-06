import React, { useState, useEffect } from "react";

import moment from "moment";

import AntdModal from "../../atoms/modal";
import Modals from "./modal.style";
import DatePicker from "../../atoms/datepicker";
import withDirection from "../../hoc/with-direction";
import { NewsFee } from "../../../shared-ui/models/news-fee.model";
import Form from "../../atoms/form";
import Row from "../../atoms/row";
import FormItem from "../../molecules/form-item";
import BuildingTree from "..//building-tree";
import Input, { InputArea } from "../../atoms/input";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

export interface INewsFeeModal {
  visible?: boolean;
  onClose?(): void;
  condominiumId?: number;
  onAction?(newsFee: NewsFee): void;
}

const NewsFeeModal: React.FC<INewsFeeModal> = ({
  visible,
  condominiumId,
  onAction,
  onClose
}) => {
  const [form, setForm] = useState<NewsFee>({ apartmentKeys: [] });
  const handleChange = (event: any) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const onItemSelect = (name: string, value: any) => {
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    if (!visible) setForm({ apartmentKeys: [] });
  }, [visible]);

  return (
    <Modal
      onCancel={onClose}
      onOk={() => onAction && onAction!(form)}
      okButtonProps={{
        disabled:
          !form.title || !form.description || !form.apartmentKeys!.length
      }}
      visible={visible}
      cancelText="Cancelar"
      okText="Crear Noticia"
      title="Crear Noticia"
    >
      <Form>
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
          <FormItem label="Fecha de Expiración" sm={24} md={24}>
            <DatePicker
              allowClear={false}
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              onChange={(_: moment.Moment, dateStr: string) =>
                onItemSelect("endDate", dateStr)
              }
              value={
                form.endDate ? moment(form.endDate, "DD/MM/YYYY") : undefined
              }
            />
          </FormItem>
          <FormItem label="Contenido" sm={24} md={24}>
            <InputArea
              placeholder="Contenido"
              className="isoCardInput"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </FormItem>
          <FormItem sm={24} md={24} label="Apartamentos">
            <BuildingTree
              condominiumId={condominiumId!}
              selectedKeys={form.apartmentKeys || []}
              setSelectedKeys={apartmentKeys =>
                setForm({ ...form, apartmentKeys })
              }
            />
          </FormItem>
        </Row>
      </Form>
    </Modal>
  );
};

export default NewsFeeModal;
