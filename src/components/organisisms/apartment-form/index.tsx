import React from "react";

import Input from "../../atoms/input";
import Switch from "../../atoms/switch";
import FormItem from "../../molecules/form-item";
import { Apartment } from "../../../shared-ui/models/apartment";
import { changeHandler } from "../../../shared-ui/utils/input";

export interface IApartmentForm {
  apartment: Apartment;
  apartmentChange(apartment: Apartment): void;
}

export default function ApartmentForm(props: IApartmentForm) {
  const { apartment, apartmentChange } = props;
  const changer = changeHandler(apartment, apartmentChange);
  return (
    <>
      <FormItem label="Edificio" sm={24} md={24}>
        <Input
          disabled={true}
          name="buildingId"
          value={apartment.buildingId}
          onChange={changer}
        />
      </FormItem>
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
      <FormItem label="Disponible">
        <br />
        <Switch
          checked={apartment.vacancy!}
          onChange={checked => {
            console.log("vacancy", checked);
            changer({ target: { name: "vacancy", value: checked } });
          }}
        />
      </FormItem>
      <FormItem label="Costo Mantenimiento">
        <Input
          name="maintenanceRate"
          type="number"
          value={apartment.maintenanceRate}
          onChange={changer}
        />
      </FormItem>
    </>
  );
}
