import React from "react";
import { Service } from "../../../shared-ui/models/service.model";
import { changeHandler } from "../../../shared-ui/utils/input";
import Input from "../../atoms/input";
import Checkbox from "../../atoms/checkbox";
import Icon from "../../atoms/icon";
import Select from "../../atoms/select";
import FormItem from "../../molecules/form-item";
import { Keylist } from "../../../shared-ui/models/keylist";

export interface IServiceForm {
  service: Service;
  keylist: Keylist;
  serviceChanged?(service: Service): void;
}

export default function ServiceForm(props: IServiceForm) {
  const { service, keylist, serviceChanged } = props;
  const changer = changeHandler(service, serviceChanged!);
  const onServiceChange = (name: string, value: any) => {
    const newService = { ...service };
    serviceChanged!({ ...newService, [name]: value });
  };

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
      <FormItem label="Tipo de Tasación">
        <Select
          data={keylist.serviceTypes}
          name="serviceType"
          onChangeItem={onServiceChange}
          value={service.serviceType}
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
      <FormItem label="Monto" sm={24} md={8}>
        <Input
          required={true}
          name="amount"
          onChange={changer}
          value={service.amount}
          type="number"
        />
      </FormItem>
      <FormItem label="Mora" sm={12} md={8}>
        <Input
          required={true}
          name="lateFee"
          onChange={changer}
          suffix={service.percent ? <Icon type="percentage" /> : <span />}
          value={service.lateFee}
          type="number"
        />
      </FormItem>
      <FormItem label="" sm={12} md={8}>
        <Checkbox
          name="percent"
          checked={service.percent}
          onChange={e => onServiceChange("percent", e.target.checked)}
        >
          Porcentaje
        </Checkbox>
      </FormItem>
    </>
  );
}
