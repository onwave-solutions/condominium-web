import React, { useState } from "react";

import AntdModal from "../../atoms/modal";
import { BankAccount } from "../../../shared-ui/models/bank-account";
import Modals from "../../hoc/with-modal-style";
import FormItem from "../../molecules/form-item";
import Select from "../../atoms/select";
import Row from "../../atoms/row";
import withDirection from "../../hoc/with-direction";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

export interface IBankAccountSelector {
  accounts?: BankAccount[];
  onAction?(accountId: number): void;
  visible?: boolean;
  onClose?(): void;
}

const BankAccountSelector: React.FC<IBankAccountSelector> = ({
  visible = false,
  accounts = [],
  onAction,
  onClose
}) => {
  const [accountId, setBankAccountId] = useState<number | undefined>();

  const onItemSelect = (_: string, value: any) => {
    setBankAccountId(value);
  };

  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      cancelText="Cancelar"
      okText="Aceptar"
      onOk={() => onAction && onAction(accountId!)}
      okButtonProps={{ disabled: !accountId }}
      title="Selecciona una cuenta"
    >
      <Row>
        <FormItem label="Caja" md={24} sm={24}>
          <Select
            name="bankAccountId"
            typeName="id"
            renderNode={(account: BankAccount) => {
              return `${account.account} [${account.bank!.name}] (${
                account.balance
              } RD$)`;
            }}
            onChangeItem={onItemSelect}
            value={accountId}
            data={accounts}
          />
        </FormItem>
      </Row>
    </Modal>
  );
};

export default BankAccountSelector;
