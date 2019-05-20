import React from "react";

import Input from "../../atoms/input";
import Select from "../../atoms/select";
import FormItem from "../../molecules/form-item";

import { User } from "../../../shared-ui/models/user";
import { Keylist, KeylistType } from "../../../shared-ui/models/keylist";
import { changeHandler } from "../../../shared-ui/utils/input";

export interface IUserForm {
  user?: Partial<User>;
  keylist?: Keylist;
  userChanged?(user: User): void;
}

export default function UserForm(props: IUserForm) {
  const { user, userChanged, keylist } = props;
  const changer = changeHandler(user!, userChanged!);
  const onItemSelect = (name: string, value: any) => {
    userChanged!({ ...user, [name]: value });
  };
  const disabledPStatus = (status: KeylistType) => {
    if (["P", "C"].includes(status.type!)) {
      status.disabled = true;
    }

    return status;
  };
  return (
    <>
      <FormItem label={"Usuario"}>
        <Input
          name="username"
          onChange={changer}
          value={user!.username}
          disabled={Boolean(user!.id)}
        />
      </FormItem>
      <FormItem label="Estado">
        <Select
          name="status"
          disabled={["P", "C"].includes(user!.status!) || !user!.id}
          data={keylist!.userStatus!.map(disabledPStatus)}
          value={user!.status}
          onChangeItem={onItemSelect}
        />
      </FormItem>
      <FormItem label="Nombre">
        <Input name="name" onChange={changer} value={user!.name} />
      </FormItem>
      <FormItem label="Apellido">
        <Input name="lastName" onChange={changer} value={user!.lastName} />
      </FormItem>
      <FormItem label="Tipo de documento">
        <Select
          name="documentId"
          onChangeItem={onItemSelect}
          value={user!.documentId}
          data={keylist!.documentTypes!}
        />
      </FormItem>
      <FormItem label="Documento">
        <Input name="document" onChange={changer} value={user!.document} />
      </FormItem>
    </>
  );
}

UserForm.defaultProps = {
  user: {},
  keylist: {}
} as Partial<IUserForm>;
