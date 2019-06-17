import React, { useState, useEffect } from "react";
import { AutoComplete, Spin } from "antd";

import AntdModal from "../../atoms/modal";
import Form from "../../atoms/form";
import Row from "../../atoms/row";
import Select from "../../atoms/select";
import Modals from "../../hoc/with-modal-style";
import withDirection from "../../hoc/with-direction";
import FormItem from "../../molecules/form-item";
import Input from "../../atoms/input";
import { Supplier } from "../../../shared-ui/models/supplier.model";
import { User } from "../../../shared-ui/models/user";
import { Keylist } from "../../../shared-ui/models/keylist";
import { changeHandler } from "../../../shared-ui/utils/input";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

const { Option } = AutoComplete;

export interface ITenantCreateForm {
  visible?: boolean;
  onClose?(): void;
  onAction?(tenant: User): void;
  keylist?: Keylist;
  onSearchTenant?(user: Partial<User>): Promise<User[]>;
}

let timeout: any;

export default function TenantCreateForm({
  visible,
  onClose,
  keylist,
  onAction,
  onSearchTenant
}: ITenantCreateForm) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({});
  const changer = changeHandler(user, setUser);
  const onItemSelect = (name: string, value: any) => {
    setUser({ ...user, [name]: value });
  };

  const searchByDocument = () => {
    if (!user.document || !onSearchTenant) return;
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const data = await onSearchTenant({ document: user.document });
      setUsers(data);
    }, 300);
  };

  useEffect(() => {
    searchByDocument();
  }, [user.document]);

  useEffect(() => {
    if (visible) return;
    setUser({});
    setUsers([]);
  }, [visible]);

  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      onOk={() => onAction!(user)}
      cancelText="Cancelar"
      okText="Crear Inquilino"
      title="Crear Inquilino"
    >
      <Row>
        <Form className="isoCardInfoForm">
          <FormItem label="Tipo de documento">
            <Select
              name="documentId"
              onChangeItem={onItemSelect}
              value={user!.documentId}
              data={keylist!.documentTypes!}
            />
          </FormItem>
          <FormItem label="Documento">
            <AutoComplete
              value={user!.document}
              backfill={true}
              onChange={value => {
                console.log(value);
                setUser({ ...user, document: value as string });
              }}
              //placeholder="Documento"
              style={{ width: "100%" }}
            >
              {users.map(user => (
                <Option key={user.id}>
                  {user.name} {user.lastName}({user.document})
                </Option>
              ))}
            </AutoComplete>
          </FormItem>
          <FormItem label="Nombre">
            <Input
              name="name"
              onChange={changer}
              value={user!.name}
              //disabled={disabledAll}
            />
          </FormItem>
          <FormItem label="Apellido">
            <Input
              name="lastName"
              onChange={changer}
              value={user!.lastName}
              //disabled={disabledAll}
            />
          </FormItem>
          <FormItem label={"Usuario"} sm={24} md={24}>
            <Input
              name="username"
              required={true}
              onChange={changer}
              value={user!.username}
              //disabled={Boolean(user!.id) || disabledAll}
            />
          </FormItem>
        </Form>
      </Row>
    </Modal>
  );
}
