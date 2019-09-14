import { useEffect, useState } from "react";
import { User } from "../../shared-ui/models/user";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { select } from "../../shared-ui/store/selectors";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { Condominium } from "../../shared-ui/models/condominium";
import {
  getCondominiumsByManagerIdAction,
  setDefaultCondominiumAction,
  setCondominiumToManagerAction
} from "../../shared-ui/store/actions/manager.action";
import { bankAccountSelector } from "../../shared-ui/store/selectors/bank-account.selector";
import { refreshBankAccountsAction } from "../../shared-ui/store/actions/bank-account.actions";
import { serviceSelector } from "../../shared-ui/store/selectors/service.selector";
import { loadServicesAction } from "../../shared-ui/store/actions/service.action";

const serviceState = select(serviceSelector);
const managerState = select(managerSelector);
const bankAccountState = select(bankAccountSelector);

export default function useManagerCondominium(
  user: User,
  id?: string
): [Condominium[], Partial<Condominium>, (value: Condominium) => void] {
  if (!user.id || user.roleId !== "MA") return [[], {}, () => undefined];

  const condominiums = useReduxState(managerState("condominiums"));
  const selectedCondo = useReduxState(managerState("condominium"));

  const bankAccounts = useReduxState(
    bankAccountState(["bankAccounts", "length"])
  );
  const services = useReduxState(serviceState(["services", "length"]));

  const getCondominiumsByManagerId = useReduxAction(
    getCondominiumsByManagerIdAction(id)
  );

  const setDefaultCondominium = useReduxAction(setDefaultCondominiumAction(id));
  const setSelectedCondominium = useReduxAction(setCondominiumToManagerAction);
  const loadBankAccounts = useReduxAction(refreshBankAccountsAction());
  const loadServices = useReduxAction(loadServicesAction());

  const [condominium, setCondominium] = useState<Condominium>(selectedCondo);

  useEffect(() => {
    getCondominiumsByManagerId(user.id!);
  }, []);

  useEffect(() => {
    if (selectedCondo.id === condominium.id) return;
    setCondominium(selectedCondo);
  }, [selectedCondo.id]);

  useEffect(() => {
    if (!condominium.id) return;
    setDefaultCondominium({
      condominiumId: condominium.id,
      managerId: user.id
    });
    setSelectedCondominium(condominium);
    loadBankAccounts({ condominiumId: condominium.id, disabled: false });
    loadServices({ condominiumId: condominium.id, deprecated: false });
  }, [condominium.id]);

  condominium.isValid = bankAccounts > 0 && services > 0;

  return [condominiums, condominium, setCondominium];
}
