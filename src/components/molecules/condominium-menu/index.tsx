import React from "react";

import Menu from "../../atoms/menu";
import { Condominium } from "../../../shared-ui/models/condominium";

export interface ICondominiumMenuDropdown {
  condominiums: Condominium[];
  onChange?(condominium: Condominium): void;
}

export default function CondominiumMenuDropdown(
  props: ICondominiumMenuDropdown
) {
  const { condominiums, onChange } = props;
  return (
    <Menu
      onSelect={({ key }) =>
        onChange && onChange(condominiums.find(x => `${x.id!}` === `${key}`)!)
      }
    >
      {condominiums.map(condominium => (
        <Menu.Item key={condominium.id}>{condominium.name}</Menu.Item>
      ))}
    </Menu>
  );
}
