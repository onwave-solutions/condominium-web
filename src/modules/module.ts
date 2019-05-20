import admin from "./admin/module";
import manager from "./manager/module";
import apartment from "./apartment/module";
import building from "./building/module";
import condominium from "./condominium/module";
import company from "./company/module";
import tenant from "./tenant/module";
import condominumManager from "./condominium-manager/module";

import { IModule } from "../shared-ui/models/module";

export const modules = [
  admin,
  manager,
  apartment,
  building,
  company,
  condominium,
  tenant,
  condominumManager
];

export const modulesByPermissions: { [id: string]: IModule[] } = {
  SA: modules,
  AD: [admin, company, manager, condominium],
  MA: [building],
  TE: []
};
