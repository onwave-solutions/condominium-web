import React, { useState } from "react";

import Input from "../../atoms/input";
import Select from "../../atoms/select";
import Modal from "../../atoms/modal";
import Row from "../../atoms/row";
import FormItem from "../../molecules/form-item";
import { Building } from "../../../shared-ui/models/building";
import { changeHandler } from "../../../shared-ui/utils/input";
import { User } from "../../../shared-ui/models/user";

export interface ITenantSelectForm {
  visible: boolean;
  tenants: User[];
  onClose(): void;
  onSubmit(tenantId: number): void;
}

export default function TenantSelectForm({
  onClose,
  tenants,
  onSubmit,
  visible
}: ITenantSelectForm) {
  const [value, setValue] = useState<number | undefined>();

  return (
    <>
      <Modal
        title="Agregar Inquilino"
        visible={visible}
        onCancel={onClose}
        onOk={() => value && onSubmit(value)}
      >
        <Row>
          <FormItem label="Inquilino" sm={24} md={24}>
            <Select
              data={tenants}
              typeName="id"
              value={value}
              onChange={setValue as any}
              renderNode={(tenant: User) => (
                <span>
                  {tenant.name} {tenant.lastName}
                  {" ["}
                  {tenant.document}
                  {"]"}
                </span>
              )}
            />
          </FormItem>
        </Row>
      </Modal>
    </>
  );
}
