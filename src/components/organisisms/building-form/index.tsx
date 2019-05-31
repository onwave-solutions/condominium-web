import React from "react";

import Input from "../../atoms/input";
import FormItem from "../../molecules/form-item";
import { Building } from "../../../shared-ui/models/building";
import { changeHandler } from "../../../shared-ui/utils/input";

export interface IBuildingForm {
  building: Building;
  buildingChange?(building: Building): void;
}

export default function BuildingForm(props: IBuildingForm) {
  const { building, buildingChange } = props;
  const changer = changeHandler(building, buildingChange!);
  return (
    <>
      <FormItem label="Nombre" sm={24} md={24}>
        <Input name="name" value={building.name} onChange={changer} />
      </FormItem>
    </>
  );
}
