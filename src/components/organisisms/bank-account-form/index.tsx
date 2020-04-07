import React from "react";

import Input from "../../atoms/input";
import Select from "../../atoms/select";
import FormItem from "../../molecules/form-item";

import { BankAccount } from "../../../shared-ui/models/bank-account";

import { changeHandler } from "../../../shared-ui/utils/input";
import { Keylist } from "../../../shared-ui/models/keylist";

export interface IBankAccountForm {
  bankAccount: BankAccount;
  keylist?: Keylist;
  bankAccountChange?(value: BankAccount): void;
}

export default function BankAccountForm(props: IBankAccountForm) {
  const { bankAccount, bankAccountChange, keylist } = props;
  const changer = changeHandler(bankAccount, bankAccountChange!);
  const onItemSelect = (name: string, value: any) => {
    bankAccountChange && bankAccountChange!({ ...bankAccount, [name]: value });
  };

  return (
    <>
      <FormItem label="Caja" sm={24} md={12}>
        <Select
          name="bankId"
          onChangeItem={onItemSelect}
          value={bankAccount.bankId}
          data={keylist!.banks}
        />
      </FormItem>
      <FormItem label="Número de Referencia" sm={24} md={12}>
        <Input name="account" value={bankAccount.account} onChange={changer} />
      </FormItem>
      <FormItem
        label={bankAccount.id ? "Balance" : "Balance Inicial"}
        sm={24}
        md={12}
      >
        <Input
          name="balance"
          disabled={Boolean(bankAccount.id)}
          value={bankAccount.balance}
          onChange={changer}
          type="number"
        />
      </FormItem>
      <FormItem label="Descripción" sm={24} md={12}>
        <Input
          name="description"
          value={bankAccount.description}
          onChange={changer}
        />
      </FormItem>
    </>
  );
}
