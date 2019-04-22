import React from "react";

import Input from "../../atoms/input";
import FormItem from "../../molecules/form-item";

import { User } from "../../../shared-ui/models/user";

export interface IUserForm {
  user?: Partial<User>;
}

export default function UserForm(props: IUserForm) {
  return (
    <>
      <FormItem label={"Usuario"}>
        <Input />
      </FormItem>
      <FormItem label="Estado">
        <Input />
      </FormItem>
      <FormItem label="Nombre">
        <Input />
      </FormItem>
      <FormItem label="Apellido">
        <Input />
      </FormItem>
      <FormItem label="Tipo de documento">
        <Input />
      </FormItem>
      <FormItem label="Documento">
        <Input />
      </FormItem>
      <FormItem label="Fecha de creación">
        <Input disabled={true} />
      </FormItem>
      <FormItem label="Creado por">
        <Input disabled={true} />
      </FormItem>
      <FormItem label="Fecha de modificación">
        <Input disabled={true} />
      </FormItem>
      <FormItem label="Modificado por">
        <Input disabled={true} />
      </FormItem>
    </>
  );
}

UserForm.defaultProps = {
  user: {}
} as Partial<IUserForm>;
