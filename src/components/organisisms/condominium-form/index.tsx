import React from "react";

import Input from "../../atoms/input";
import FormItem from "../../molecules/form-item";

export interface ICondominiumForm {}

export default function CondominiumForm(props: ICondominiumForm) {
  return (
    <>
      <FormItem label="Nombre" sm={24} md={24}>
        <Input />
      </FormItem>
      <FormItem label="Dirección" sm={24} md={24}>
        <Input />
      </FormItem>
      <FormItem label="Latitud">
        <Input disabled={true} />
      </FormItem>
      <FormItem label="Longitud">
        <Input disabled={true} />
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
