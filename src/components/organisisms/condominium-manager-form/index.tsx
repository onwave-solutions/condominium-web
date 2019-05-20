import React from "react";

import Input from "../../atoms/input";
import Select from "../../atoms/select";
import FormItem from "../../molecules/form-item";
import { Condominium } from "../../../shared-ui/models/condominium";
import { User } from "../../../shared-ui/models/user";

export interface ICondominiumManagerForm {
  condominium: Condominium;
  onManagerChange?(manager: User): void;
  manager: User;
  managers: User[];
}

export default function CondominiumManagerForm(props: ICondominiumManagerForm) {
  const { condominium, onManagerChange, manager, managers } = props;
  const handleManagerChange = (managerId: number) => {
    const manager = managers.find(x => x.id === managerId);
    onManagerChange && onManagerChange(manager!);
  };
  return (
    <>
      <FormItem label="Condominio" sm={24} md={24}>
        <Input disabled={true} value={condominium.name} />
      </FormItem>
      <FormItem label="Manager" sm={24} md={24}>
        <Select
          value={manager.id}
          typeName="id"
          labelName="name"
          data={managers}
          onSelect={handleManagerChange as any}
          renderNode={(item: User) => {
            return (
              <>{`${item.name} ${item.lastName} [${item.username} - ${
                item.document
              }]`}</>
            );
          }}
        />
      </FormItem>
    </>
  );
}
