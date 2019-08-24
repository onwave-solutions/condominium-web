import React, { useState, useEffect } from "react";
import { AutoComplete, Spin } from "antd";

import get from "lodash/get";

import { Rifm } from "rifm";
import AntdModal from "../../atoms/modal";
import Form from "../../atoms/form";
import Row from "../../atoms/row";
import Select from "../../atoms/select";
import Modals from "../../hoc/with-modal-style";
import withDirection from "../../hoc/with-direction";
import FormItem from "../../molecules/form-item";
import Input from "../../atoms/input";
import { User } from "../../../shared-ui/models/user";
import {
  Keylist,
  AdvanceQuery,
  Query
} from "../../../shared-ui/models/keylist";
import {
  changeHandler,
  phoneFormat,
  identificationFormat,
  isValidId,
  isValidDocument
} from "../../../shared-ui/utils/input";
import { KeyOf } from "../../../shared-ui/utils/objects";
import { validateEmail } from "../../../shared-ui/utils/strings";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

const { Option } = AutoComplete;

export interface ITenantCreateForm {
  visible?: boolean;
  tenant?: User;
  loading?: boolean;
  onClose?(): void;
  onAction?(tenant: User): void;
  keylist?: Keylist;
  onSearchTenant?(user: AdvanceQuery<User>): Promise<User[]>;
}

let timeout: any;

export default function TenantCreateForm({
  visible,
  onClose,
  keylist,
  tenant,
  loading,
  onAction,
  onSearchTenant
}: ITenantCreateForm) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({});
  const changer = changeHandler(user, setUser);

  const editMode: boolean = Boolean(tenant) && Boolean(tenant!.id);
  const createModeDisable: boolean = Boolean(user.id);

  const onItemSelect = (name: string, value: any) => {
    setUser({ ...user, [name]: value });
  };

  const getInUser = (path: KeyOf<User> | [KeyOf<User>], def?: any) =>
    get(user, path, def);

  const searchByDocument = () => {
    if (!user.document || user.id || !onSearchTenant) return;
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const data = await onSearchTenant({
        document: {
          like: (user.document || "").replace(/[^a-zA-Z0-9]/g, "")
        }
      });
      setUsers(data);
    }, 300);
  };

  useEffect(() => {
    searchByDocument();
  }, [user.document]);

  useEffect(() => {
    if (visible || editMode) return;
    setUser({});
    setUsers([]);
  }, [visible]);

  useEffect(() => {
    setUser({ ...tenant });
  }, [tenant]);

  const onSelectTenant = (id: any) => {
    const tenant = users.find(x => `${x.id}${x.document}` === id);
    if (!tenant) return;
    setTimeout(() => {
      setUser({
        id: tenant.id,
        documentId: tenant.documentId,
        document: tenant.document,
        name: tenant.name,
        lastName: tenant.lastName,
        username: tenant.username
      });
    });
  };

  const formatID = identificationFormat(user.documentId);
  const isDocumentValid = isValidDocument(user.documentId);
  const isValid =
    validateEmail(getInUser("username", "")) &&
    isDocumentValid(getInUser("document")) &&
    getInUser("documentId") &&
    getInUser("name");

  return (
    <Modal
      width="70%"
      onCancel={onClose}
      visible={visible}
      onOk={() => onAction!(user)}
      okButtonProps={{
        disabled: loading || !isValid
      }}
      cancelText="Cancelar"
      okText={user.id ? "Actualizar Inquilino" : "Crear Inquilino"}
      title={user.id ? "Actualizar Inquilino" : "Crear Inquilino"}
    >
      <Row>
        <Form className="isoCardInfoForm">
          <FormItem label="Tipo de documento">
            <Select
              name="documentId"
              onChangeItem={onItemSelect}
              disabled={createModeDisable || editMode}
              value={user!.documentId || ""}
              data={keylist!.documentTypes!}
            />
          </FormItem>
          <FormItem label="Documento">
            <Rifm
              value={user ? user!.document || "" : ""}
              format={formatID}
              accept={/\d+/g}
              onChange={value => {
                if (user.id) {
                  setUser({ document: value as string });
                } else {
                  setUser({
                    ...user,
                    id: undefined,
                    document: value as string
                  });
                }
              }}
            >
              {({ value, onChange }) => {
                return (
                  <AutoComplete
                    backfill={false}
                    allowClear={true}
                    dataSource={users.map(user => (
                      <Option key={user.id + user.document!}>
                        {user.name} {user.lastName}(
                        {identificationFormat(user.documentId)(user.document)})
                      </Option>
                    ))}
                    disabled={editMode}
                    onSelect={onSelectTenant}
                    onChange={(value: any) => {
                      onChange({ target: { value, type: "string" } } as any);
                    }}
                    style={{ width: "100%" }}
                    value={value}
                  />
                );
              }}
            </Rifm>
          </FormItem>
          <FormItem label={"Email"} sm={24} md={24}>
            <Input
              name="username"
              required={true}
              onChange={changer}
              value={user!.username || ""}
              disabled={createModeDisable || editMode}
            />
          </FormItem>
          <FormItem label="Nombre">
            <Input
              name="name"
              onChange={changer}
              disabled={createModeDisable && !editMode}
              value={user!.name || ""}
            />
          </FormItem>
          <FormItem label="Apellido">
            <Input
              name="lastName"
              onChange={changer}
              disabled={createModeDisable && !editMode}
              value={user!.lastName || ""}
            />
          </FormItem>
          <FormItem label="Teléfono">
            <Rifm
              value={user!.phone!}
              format={phoneFormat}
              accept={/\d+/g}
              onChange={str => setUser!({ ...user, phone: str })}
            >
              {({ value, onChange }) => (
                <Input
                  name="phone"
                  disabled={createModeDisable && !editMode}
                  onChange={onChange}
                  value={value}
                />
              )}
            </Rifm>
          </FormItem>
          <FormItem label="Celular">
            <Rifm
              value={user!.cellphone!}
              format={phoneFormat}
              accept={/\d+/g}
              onChange={str => setUser!({ ...user, cellphone: str })}
            >
              {({ value, onChange }) => (
                <Input
                  name="cellphone"
                  onChange={onChange}
                  disabled={createModeDisable && !editMode}
                  value={value}
                />
              )}
            </Rifm>
          </FormItem>
          <FormItem label="Dirección" md={24} sm={24}>
            <Input
              name="address"
              onChange={changer}
              value={user!.address}
              disabled={createModeDisable && !editMode}
            />
          </FormItem>
        </Form>
      </Row>
    </Modal>
  );
}
