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

const managerState = select(managerSelector);

export default function useManagerCondominium(
  user: User,
  id?: string
): [Condominium[], Partial<Condominium>, (value: Condominium) => void] {
  if (!user.id || user.roleId !== "MA") return [[], {}, () => undefined];

  const condominiums = useReduxState(managerState("condominiums"));
  const selectedCondo = useReduxState(managerState("condominium"));

  const getCondominiumsByManagerId = useReduxAction(
    getCondominiumsByManagerIdAction(id)
  );

  const setDefaultCondominium = useReduxAction(setDefaultCondominiumAction(id));
  const setSelectedCondominium = useReduxAction(setCondominiumToManagerAction);

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
  }, [condominium.id]);

  return [condominiums, condominium, setCondominium];
}
