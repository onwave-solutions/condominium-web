import admin from "./admin/module";
import condominium from "./condominium/module";
import company from "./company/module";
import tenant from "./tenant/module";

import { IModule } from "../shared-ui/models/module";

export default [admin, company, condominium, tenant] as IModule[];
