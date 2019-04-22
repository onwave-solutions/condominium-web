import React from "react";

import Input from "../../atoms/input";
import FormItem from "../../molecules/form-item";

export interface ICompanyForm {}

export default function CompanyForm(props: ICompanyForm) {
  return (
    <>
      <FormItem label="Nombre" sm={24} md={24}>
        <Input />
      </FormItem>
      <FormItem label="Estado">
        <Input />
      </FormItem>
      <FormItem label="Tipo de documento">
        <Input />
      </FormItem>
      <FormItem label="Documento">
        <Input />
      </FormItem>
      <FormItem label="Teléfono">
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
