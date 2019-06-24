import React, { useEffect } from "react";
import _ from "lodash";
import debounce from "lodash/fp/debounce";

import Topbar from "../../organisisms/topbar";
import Sidebar from "../../organisisms/sidebar";
import ShellTemplate from "../../templates/shell-template";
import BladeManager from "../../organisisms/blade-manager";
import Icon from "../../atoms/icon";
import Menu from "../../atoms/menu";
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
  setSideBarVisibility,
  logoutAction
} from "../../../shared-ui/store/actions/app";
import useManagerCondominium from "../../hooks/use-manager-condominium";
import CondominiumMenuDropdown from "../../molecules/condominium-menu";
import useTenantApartment from "../../hooks/use-tenant-apartment";
import { Apartment } from "../../../shared-ui/models/apartment";
import WrapperTemplate from "../../templates/wrapper-template";

const appState = select(appSelector);

function subscribe(subscriber: any) {
  window.addEventListener("resize", subscriber);

  return () => {
    window.removeEventListener("resize", subscriber);
  };
}

function formatApartment(apartment: Apartment) {
  if (!apartment.id) return "";
  return `${apartment.name} (${apartment.building!.condominium!.name} - ${
    apartment.building!.name
  }) `;
}

export default function Shell(props: any) {
  const { url } = props.match;
  const user = useReduxState(appState("user"));
  const visivility = useReduxState(appState("visibility"));
  const modules = modulesByPermissions[user.roleId!];

  const handleAddBlade = useReduxAction(addBlade);
  const loadKeylist = useReduxAction(loadKeylistAction);
  const handleSetVisibility = useReduxAction(setSideBarVisibility);
  const onLogOut = useReduxAction(logoutAction);

  const [
    condominiumsManager,
    condominiumSelected,
    changeCondominium
  ] = useManagerCondominium(user);
  const [apartments, selectedApartment, changeApartment] = useTenantApartment(
    user
  );
  const handleWindowResize = () => {
    if (window.innerWidth > 800) {
      //setCollapsed(false);
      handleSetVisibility(false);
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

  const isValid =
    Boolean(selectedApartment.id) ||
    Boolean(condominiumSelected.id) ||
    (user.id || user.roleId === "AD");

  return (
    <ShellTemplate
      topBar={
        <Topbar
          collapsed={visivility}
          onCollapsedChange={handleSetVisibility}
          onCloseSession={onLogOut}
        >
          {user.roleId === "TE" && (
            <Dropdown
              overlay={() => (
                <Menu
                  onClick={({ key }) =>
                    changeApartment(apartments.find(x => `${x.id}` === key)!)
                  }
                  selectedKeys={[`${selectedApartment.id}`]}
                >
                  {_.entries(_.groupBy(apartments, "buildingId")).map(
                    ([key, values]) => {
                      const nodes: any[] = [];
                      const zero = values[0];
                      nodes.push(
                        <Menu.Item disabled={true} key={key + "entry"}>
                          {zero.building!.condominium!.name +
                            "- EDIF. " +
                            zero.building!.name}
                        </Menu.Item>
                      );
                      values.forEach(value =>
                        nodes.push(
                          <Menu.Item key={value.id}>{value.name}</Menu.Item>
                        )
                      );
                      return nodes;
                    }
                  )}
                </Menu>
              )}
            >
              <Button type="ghost">
                <span>
                  {formatApartment(selectedApartment) ||
                    "Seleccione un apartamento"}
                </span>
                <Icon type="down" />
              </Button>
            </Dropdown>
          )}
          {user.roleId === "MA" && (
            <>
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
              <div style={{ flex: 1 }} />
              <span
                style={{
                  display: "flex",
                  textAlign: "end",
                  flexDirection: "column",
                  lineHeight: 1.1,
                  marginRight: "1.5rem"
                }}
              >
                <strong>{`${condominiumSelected.name}`}</strong>
                <span>{`${condominiumSelected.address}`}</span>
              </span>
            </>
          )}
        </Topbar>
      }
      sideBar={
        <Sidebar
          modules={isValid ? modules : []}
          onBladePress={mod => props.history.push(`${url}${mod}`)}
          collapsed={visivility}
        />
      }
    >
      {isValid ? (
        <BladeManager url={url} modules={isValid ? modules : []} />
      ) : (
        <WrapperTemplate />
      )}
    </ShellTemplate>
  );
}
