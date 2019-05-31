import admin from './admin/module';
import manager from './manager/module';
import apartment from './apartment/module';
import building from './building/module';
import condominium from './condominium/module';
import company from './company/module';
import tenant from './tenant/module';
import condominumManager from './condominium-manager/module';
import bankAccount from './bank-account/module';
import financial from './financial/module';
import invoiceView from './financial/invoice/invoice-view/module';
import invoiceEditor from './financial/invoice/invoice-editor/module';
import service from './service/module';

import { IModule } from '../shared-ui/models/module';

const serviceAndProducts: IModule = {
  title: 'Servicios y Produc.',
  id: 'parent-product-service',
  iconType: 'lock',
  children: [service]
};

export const modules = [
  admin,
  manager,
  apartment,
  building,
  company,
  condominium,
  tenant,
  condominumManager,
  bankAccount,
  financial,
  serviceAndProducts,
  invoiceView,
  invoiceEditor
];

export const modulesByPermissions: { [id: string]: IModule[] } = {
  SA: modules,
  AD: [admin, company, manager, condominium],
  MA: [building, bankAccount, serviceAndProducts, financial],
  TE: []
};
