import React from "react";

import Input from "../../atoms/input";
import FormItem from "../../molecules/form-item";

import { User } from "../../../shared-ui/models/user";

export interface IUserForm {
  user?: Partial<User>;
  userChanged?(user: User): void;
}

const changeHandler = (user: User, userChange: Function) => {
  return (event: any) => {
    const { name, value } = event.target;
    userChange({ ...user, [name]: value });
  };
};

export default function UserForm(props: IUserForm) {
  const { user, userChanged } = props;
  const changer = changeHandler(user!, userChanged as any);
  return (
    <>
      <FormItem label={"Usuario"}>
        <Input name="username" onChange={changer} value={user!.username} />
      </FormItem>
      <FormItem label="Estado">
        <Input name="state" disabled={true} value={user!.state} />
      </FormItem>
      <FormItem label="Nombre">
        <Input name="firstName" onChange={changer} value={user!.firstName} />
      </FormItem>
      <FormItem label="Apellido">
        <Input name="lastName" onChange={changer} value={user!.lastName} />
      </FormItem>
      <FormItem label="Tipo de documento">
        <Input
          name="documentType"
          onChange={changer}
          disabled={true}
          value="Cédula"
        />
      </FormItem>
      <FormItem label="Documento">
        <Input name="document" onChange={changer} />
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
