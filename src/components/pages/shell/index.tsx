import React, { useEffect } from "react";
import debounce from "lodash/fp/debounce";

import Topbar from "../../organisisms/topbar";
import Sidebar from "../../organisisms/sidebar";
import ShellTemplate from "../../templates/shell-template";
import BladeManager from "../../organisisms/blade-manager";
import Icon from "../../atoms/icon";
import Popover from "../../atoms/popover";
import Button from "../../atoms/button";
import Dropdown from "../../atoms/dropdown";

import { modulesByPermissions } from "../../../modules/module";
import { appSelector } from "../../../shared-ui/store/selectors/app";
import { select } from "../../../shared-ui/store/selectors";
import { useReduxState, useReduxAction } from "../../../shared-ui/store/hooks";
import {
  closeBlade,
  addBlade,
  loadKeylistAction,
  setSideBarVisibility
} from "../../../shared-ui/store/actions/app";
import useManagerCondominium from "../../hooks/use-manager-condominium";
import CondominiumMenuDropdown from "../../molecules/condominium-menu";

const appState = select(appSelector);

function subscribe(subscriber: any) {
  window.addEventListener("resize", subscriber);

  return () => {
    window.removeEventListener("resize", subscriber);
  };
}

export default function Shell() {
  const blades = useReduxState(appState("blades", {}));
  const user = useReduxState(appState("user"));
  const visivility = useReduxState(appState("visibility"));
  const modules = modulesByPermissions[user.roleId!];

  const handleCloseBlade = useReduxAction(closeBlade);
  const handleAddBlade = useReduxAction(addBlade);
  const loadKeylist = useReduxAction(loadKeylistAction);
  const handleSetVisibility = useReduxAction(setSideBarVisibility);

  const [
    condominiumsManager,
    condominiumSelected,
    changeCondominium
  ] = useManagerCondominium(user);
  const handleWindowResize = () => {
    if (window.innerWidth > 800) {
      //setCollapsed(false);
      return;
    }
    //setCollapsed(true);
  };

  useEffect(() => {
    const debouncer = debounce(150)(handleWindowResize);
    const unsubscribe = subscribe(debouncer);
    handleWindowResize();
    loadKeylist();
    return unsubscribe;
  }, []);

  return (
    <ShellTemplate
      topBar={
        <Topbar collapsed={visivility} onCollapsedChange={handleSetVisibility}>
          {user.roleId === "TE" && (
            <Popover
              trigger="click"
              arrowPointAtCenter={true}
              placement="bottomLeft"
            >
              <Button type="ghost">
                <span>Seleccione un Apartamento</span>
                <Icon type="down" />
              </Button>
            </Popover>
          )}

          {user.roleId === "MA" && (
            <Dropdown
              overlay={() => (
                <CondominiumMenuDropdown
                  condominiums={condominiumsManager}
                  onChange={changeCondominium}
                />
              )}
            >
              <Button type="ghost">
                <span>
                  {condominiumSelected.name || "Seleccione un condominio"}{" "}
                </span>
                <Icon type="down" />
              </Button>
            </Dropdown>
          )}
        </Topbar>
      }
      sideBar={
        <Sidebar
          modules={modules}
          onBladePress={mod => handleAddBlade(mod)}
          collapsed={visivility}
          //onBladePress={addBlade}
          //collapsed={collapsed}
        />
      }
    >
      <BladeManager
        blades={Object.values(blades)}
        onBladeClose={(id: string) => handleCloseBlade(id)}
      />
    </ShellTemplate>
  );
}
