import React from "react";
import { Service } from "../../../shared-ui/models/service.model";
import { changeHandler } from "../../../shared-ui/utils/input";
import Input from "../../atoms/input";
import FormItem from "../../molecules/form-item";

export interface IServiceForm {
  service: Service;
  serviceChanged?(service: Service): void;
}

export default function ServiceForm(props: IServiceForm) {
  const { service, serviceChanged } = props;
  const changer = changeHandler(service, serviceChanged!);

  return (
    <>
      <FormItem label="Nombre" sm={24} md={24}>
        <Input name="name" onChange={changer} value={service.name} />
      </FormItem>
      <FormItem label="Descripción" sm={24} md={24}>
        <Input
          name="description"
          onChange={changer}
          value={service.description}
        />
      </FormItem>
      <FormItem label="Dia de Corte" sm={12} md={6}>
        <Input
          name="cutoffDay"
          onChange={changer}
          value={service.cutoffDay}
          min={1}
          type="number"
          max={30}
        />
      </FormItem>
      <FormItem label="Dia de Pago" sm={12} md={6}>
        <Input
          name="dueDay"
          onChange={changer}
          value={service.dueDay}
          type="number"
          min={1}
          required={true}
          max={30}
        />
      </FormItem>
      <FormItem label="Monto" sm={24} md={12}>
        <Input
          required={true}
          name="amount"
          onChange={changer}
          value={service.amount}
          type="number"
        />
      </FormItem>
    </>
  );
}
