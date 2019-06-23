import React from "react";

import Input from "../../atoms/input";
import Select from "../../atoms/select";
import FormItem from "../../molecules/form-item";
import { Condominium } from "../../../shared-ui/models/condominium";
import { User } from "../../../shared-ui/models/user";

export interface ICondominiumManagerForm {
  condominium: Condominium;
  onManagerChange?(manager: User): void;
  onCondominiumChange?(condominum: Condominium): void;
  manager: User;
  managers: User[];
  condominiums?: Condominium[];
  disableCondo?: boolean;
  disableManager?: boolean;
}

export default function CondominiumManagerForm({
  condominium = {},
  onManagerChange,
  condominiums = [],
  onCondominiumChange,
  manager = {},
  managers = [],
  disableCondo,
  disableManager
}: ICondominiumManagerForm) {
  const handleManagerChange = (managerId: number) => {
    const manager = managers.find(x => x.id === managerId);
    onManagerChange && onManagerChange(manager!);
  };
  const handleCondominiumChange = (id: number) => {
    const condominium = condominiums.find(x => x.id === id);
    onCondominiumChange && onCondominiumChange(condominium!);
  };
  return (
    <>
      <FormItem label="Condominio" sm={24} md={24}>
        <Select
          disabled={disableCondo}
          value={condominium.id}
          typeName="id"
          labelName="name"
          data={condominiums}
          onSelect={handleCondominiumChange as any}
        />
      </FormItem>
      <FormItem label="Condominio" sm={24} md={24}>
        <Select
          value={manager.id}
          typeName="id"
          disabled={disableManager}
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
