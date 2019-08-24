import React, { useState, useEffect } from "react";

import AntdModal from "../../atoms/modal";
import {
  BankAccount,
  BankAccountTransfer
} from "../../../shared-ui/models/bank-account";
import Modals from "../../hoc/with-modal-style";
import FormItem from "../../molecules/form-item";
import Select from "../../atoms/select";
import Input from "../../atoms/input";
import Row from "../../atoms/row";
import withDirection from "../../hoc/with-direction";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

export interface IBankAccountTransfer {
  accounts?: BankAccount[];
  onAction?(transfer: BankAccountTransfer): void;
  formatter?: (value: number) => string;
  visible?: boolean;
  onClose?(): void;
}

const BankAccountTransferView: React.FC<IBankAccountTransfer> = ({
  visible = false,
  accounts = [],
  onAction,
  formatter,
  onClose
}) => {
  const [transfer, setTransfer] = useState<BankAccountTransfer>({});

  const onItemSelect = (name: string, value: any) => {
    setTransfer({
      ...transfer,
      [name]: value
    });
  };

  useEffect(() => {
    if (visible) return;
    setTransfer({});
  }, [visible]);

  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      cancelText="Cancelar"
      okText="Aceptar"
      onOk={() => onAction && onAction(transfer)}
      okButtonProps={{
        disabled:
          !transfer.to ||
          !transfer.from ||
          !transfer.balance ||
          parseFloat(`${transfer.balance}`) <= 0 ||
          transfer.to === transfer.from
      }}
      title="Selecciona una cuenta"
    >
      <Row>
        <FormItem label="Desde Caja" md={24} sm={24}>
          <Select
            name="from"
            typeName="id"
            renderNode={(account: BankAccount) => {
              return `${account.account} [${account.bank!.name}] (${
                formatter ? formatter(account.balance!) : account.balance
              })`;
            }}
            onChangeItem={onItemSelect}
            value={transfer.from}
            data={accounts}
          />
        </FormItem>
        <FormItem label="Hasta Caja" md={24} sm={24}>
          <Select
            name="to"
            typeName="id"
            renderNode={(account: BankAccount) => {
              return `${account.account} [${account.bank!.name}] (${
                formatter ? formatter(account.balance!) : account.balance
              })`;
            }}
            onChangeItem={onItemSelect}
            value={transfer.to}
            data={accounts}
          />
        </FormItem>
        <FormItem label="Monto" md={24} sm={24}>
          <Input
            name="balance"
            type="number"
            value={transfer.balance}
            onChange={({ target: { name, value } }) =>
              onItemSelect(name, value)
            }
          />
        </FormItem>
      </Row>
    </Modal>
  );
};

export default BankAccountTransferView;
