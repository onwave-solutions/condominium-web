import React, { useState, useEffect } from "react";
import AntdModal from "../../atoms/modal";
import Form from "../../atoms/form";
import Row from "../../atoms/row";
import Modals from "./modal.style";
import withDirection from "../../hoc/with-direction";
import FormItem from "../../molecules/form-item";
import BuildingTree from "..//building-tree";
import { Service } from "../../../shared-ui/models/service.model";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

export interface IBuildingTreeModal {
  visible?: boolean;
  onClose?(): void;
  condominiumId?: number;
  onAction?(service: Service): void;
}

export default function BuildingTreeModal(props: IBuildingTreeModal) {
  const { visible, onAction, condominiumId, onClose } = props;
  const [form, setForm] = useState<Service>({ apartmentKeys: [] });
  const handleChange = (event: any) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  useEffect(() => {
    if (!visible) setForm({ apartmentKeys: [] });
  }, [visible]);

  return (
    <Modal
      onCancel={onClose}
      onOk={() => onAction!(form)}
      okButtonProps={{
        disabled: !form.apartmentKeys!.length
      }}
      visible={visible}
      cancelText="Cancelar"
      okText="Asignar Plan"
      title="Asignar Plan"
    >
      <Form className="isoCardInfoForm">
        <Row>
          <FormItem sm={24} md={24} label="Apartamento afectados">
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
}
