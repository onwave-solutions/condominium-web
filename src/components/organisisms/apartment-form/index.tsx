import React from "react";

import AntSelect from "antd/lib/select";
import Input from "../../atoms/input";
import Select, { Option } from "../../atoms/select";
import Switch from "../../atoms/switch";
import FormItem from "../../molecules/form-item";
import { Apartment } from "../../../shared-ui/models/apartment";
import { changeHandler } from "../../../shared-ui/utils/input";
import { Service } from "../../../shared-ui/models/service.model";

export interface IApartmentForm {
  apartment: Apartment;
  services: Service[];
  apartmentChange(apartment: Apartment): void;
}

export default function ApartmentForm(props: IApartmentForm) {
  const { apartment, services, apartmentChange } = props;
  const changer = changeHandler(apartment, apartmentChange);
  const onItemSelect = (name: string, value: any) => {
    apartmentChange && apartmentChange!({ ...apartment, [name]: value });
  };

  return (
    <>
      <FormItem label="Nombre" sm={24} md={24}>
        <Input name="name" value={apartment.name} onChange={changer} />
      </FormItem>
      <FormItem label="Piso">
        <Input name="floor" value={apartment.floor} onChange={changer} />
      </FormItem>
      <FormItem label="Metraje">
        <Input
          name="mt2"
          type="number"
          value={apartment.mt2}
          onChange={changer}
        />
      </FormItem>
      <FormItem label="Parqueos" md={24} sm={24}>
        <Input
          name="parkingLots"
          type="number"
          value={apartment.parkingLots}
          onChange={changer}
        />
      </FormItem>
    </>
  );
}
