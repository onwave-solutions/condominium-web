import React from "react";

import Input from "../../atoms/input";
import FormItem from "../../molecules/form-item";

export interface IParkingForm {}

export default function ParkingForm(props: IParkingForm) {
  return (
    <>
      <FormItem label="Edificio">
        <Input disabled={true} />
      </FormItem>
      <FormItem label="Apartamento">
        <Input disabled={true} />
      </FormItem>
      <FormItem label="Parqueo no." sm={24} md={24}>
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
