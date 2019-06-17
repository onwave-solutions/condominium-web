import React, { useEffect } from "react";
import { IModule } from "../../shared-ui/models/module";
import BladeTemplate from "../../components/templates/blade-template";
import CondominiumManagerForm from "../../components/organisisms/condominium-manager-form";
import Col from "../../components/atoms/col";
import Button from "../../components/atoms/button";

import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { condominiumSelector } from "../../shared-ui/store/selectors/condominium";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { select } from "../../shared-ui/store/selectors";
import { loadManagerAction } from "../../shared-ui/store/actions/manager.action";
import { ManagerGrid } from "../manager";
import {
  getCondominiumManagerAction,
  setCondominiumManagerAction,
  addCondominiumManagerAction
} from "../../shared-ui/store/actions/condominium.action";

const condominiumState = select(condominiumSelector);
const managerState = select(managerSelector);

export default function CondominiumManager(props: IModule) {
  const { match } = props;
  const condominium = useReduxState(condominiumState("condominium"));
  const manager = useReduxState(condominiumState("manager"));
  const condominiumManagers = useReduxState(
    condominiumState("condominiumManagers")
  );
  const managers = useReduxState(managerState("managers"));

  const setManager = useReduxAction(setCondominiumManagerAction);
  const loadManagers = useReduxAction(loadManagerAction(props.id));
  const loadCondominiumManagers = useReduxAction(
    getCondominiumManagerAction(props.id)
  );
  const addCondominiumManager = useReduxAction(
    addCondominiumManagerAction(props.id)
  );

  useEffect(() => {
    loadManagers();
    return () => {};
  }, []);

  useEffect(() => {
    if (match && match.params && match.params.id) {
      loadCondominiumManagers(match.params.id);
    }
  }, [condominium.id]);

  return (
    <BladeTemplate
      header={
        <>
          {manager.id && (
            <Button
              onClick={() =>
                addCondominiumManager({
                  condominiumId: condominium.id,
                  managerId: manager.id
                })
              }
            >
              Agregar
            </Button>
          )}
          {manager.id && (
            <Button onClick={() => setManager({})}>Limpiar</Button>
          )}
        </>
      }
    >
      <CondominiumManagerForm
        manager={manager}
        condominium={condominium}
        managers={managers}
        onManagerChange={setManager}
      />
      <Col sm={24} md={24} style={{ paddingTop: 15 }}>
        <ManagerGrid managers={condominiumManagers} />
      </Col>
    </BladeTemplate>
  );
}
