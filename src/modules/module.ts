import admin from "./admin/module";
import manager from "./manager/module";
import apartment from "./apartment/module";
import building from "./building/module";
import condominium from "./condominium/module";
import company from "./company/module";
import tenant from "./tenant/module";

import { IModule } from "../shared-ui/models/module";

export const modules = [
  admin,
  manager,
  company,
  condominium,
  tenant,
  building,
  apartment
];

export default [admin, manager, company, condominium, tenant] as IModule[];
