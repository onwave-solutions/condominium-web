import React, { useState, useEffect } from "react";

import Form from "../../atoms/form";
import Row from "../../atoms/row";
import Select from "../../atoms/select";
import FormItem from "../../molecules/form-item";
import Input from "../../atoms/input";
import Modals from "../../hoc/with-modal-style";
import AntdModal from "../../atoms/modal";
import withDirection from "../../hoc/with-direction";
import { Expense } from "../../../shared-ui/models/expense.model";
import { Supplier } from "../../../shared-ui/models/supplier.model";
import { changeHandler } from "../../../shared-ui/utils/input";
import { BankAccount } from "../../../shared-ui/models/bank-account";

const WDModal = Modals(AntdModal);
const Modal = withDirection(WDModal);

export interface IExpenseCreateForm {
  visible?: boolean;
  onClose?(): void;
  onAction?(expense: Expense): void;
  suppliers: Supplier[];
  accounts?: BankAccount[];
}

export default function ExpenseCreateForm({
  visible,
  onClose,
  accounts,
  onAction,
  suppliers
}: IExpenseCreateForm) {
  const [expense, setExpense] = useState<Expense>({});

  const onItemSelect = (name: string, value: any) => {
    setExpense({ ...expense, [name]: value });
  };

  const changer = changeHandler(expense, setExpense);

  useEffect(() => {
    if (!visible) return;
    setExpense({});
  }, [visible]);

  console.log(expense.bankAccountId)

  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      onOk={() => onAction!(expense)}
      cancelText="Cancelar"
      okText="Agregar Gasto"
      title="Gastos"
    >
      <Row>
        <Form className="isoCardInfoForm">
          <FormItem label="Caja" md={24} sm={24}>
            <Select
              name="bankAccountId"
              typeName="id"
              renderNode={(account: BankAccount) => {
                return (
                  `${account.account} [${account.bank!.name}] (${
                    account.balance
                  } RD$)`
                );
              }}
              onChangeItem={onItemSelect}
              value={expense.bankAccountId}
              data={accounts}
            />
          </FormItem>
          <FormItem label="Suplidor">
            <Select
              name="supplierId"
              typeName="id"
              labelName="description"
              onChangeItem={onItemSelect}
              value={expense.supplierId || ""}
              data={suppliers}
            />
          </FormItem>
          <FormItem label="Monto">
            <Input
              name="amount"
              type="number"
              onChange={changer}
              value={expense.amount}
            />
          </FormItem>
          <FormItem label="Descripción del Gasto" md={24} sm={24}>
            <Input
              name="description"
              onChange={changer}
              value={expense.description}
            />
          </FormItem>
        </Form>
      </Row>
    </Modal>
  );
}
