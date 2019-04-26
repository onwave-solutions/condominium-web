import React from "react";

import Input from "../../atoms/input";
import FormItem from "../../molecules/form-item";
import { Condominium } from "../../../shared-ui/models/condominium";

export interface ICondominiumForm {
  condominium: Condominium;
  condominiumChanged?(condominium: Condominium): void;
}

const changeHandler = (condominium: Condominium, userChange: Function) => {
  return (event: any) => {
    const { name, value } = event.target;
    userChange({ ...condominium, [name]: value });
  };
};

export default function CondominiumForm(props: ICondominiumForm) {
  const { condominium, condominiumChanged } = props;
  const changer = changeHandler(condominium!, condominiumChanged as any);

  return (
    <>
      <FormItem label="Nombre" sm={24} md={24}>
        <Input name="name" onChange={changer} value={condominium.name} />
      </FormItem>
      <FormItem label="Dirección" sm={24} md={24}>
        <Input name="address" onChange={changer} value={condominium.address} />
      </FormItem>
      <FormItem label="Latitud">
        <Input
          disabled={true}
          name="latitude"
          onChange={changer}
          value={condominium.latitude}
        />
      </FormItem>
      <FormItem label="Longitud">
        <Input
          disabled={true}
          name="longitude"
          onChange={changer}
          value={condominium.longitude}
        />
      </FormItem>
    </>
  );
}
