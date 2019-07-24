import React from "react";
import Layout from "antd/lib/layout";

import Button from "../../atoms/button";
import Icon from "../../atoms/icon";
import Menu from "../../atoms/menu";
import Dropdown from "../../atoms/dropdown";
import Popover from "../../atoms/popover";
import TopbarDropdown from "../../molecules/topbar-dropdown";

const { Header } = Layout;

export interface ITopbar {
  collapsed?: boolean;
  hasApartments?: boolean;
  onCollapsedChange?(value: boolean): void;
  onToggleView?(): void;
  onCloseSession?(): void;
  role?: string;
  children?: React.ReactNode;
}

export default function Topbar({
  collapsed,
  role,
  hasApartments,
  onCloseSession,
  onCollapsedChange,
  children,
  onToggleView
}: ITopbar) {
  const styling = {
    // background: customizedTheme.backgroundColor,
    position: "fixed" as any,
    width: "100%",
    display: "flex",
    height: 70
  };
  return (
    <>
      <Header
        style={styling}
        className={
          collapsed ? "isomorphicTopbar collapsed" : "isomorphicTopbar"
        }
      >
        <div className="isoLeft">
          <Icon
            type={"bars"}
            style={{ fontSize: "1.5rem", marginRight: "0.7rem" }}
            onClick={() => onCollapsedChange && onCollapsedChange(!collapsed)}
          />
          {children}
        </div>

        <div className="isoRight">
          {hasApartments ? (
            <Dropdown
              overlay={() => (
                <Menu>
                  <Menu.Item key="tenant" onClick={onToggleView}>
                    {role === "TE" ? "Vista General" : "Vista de inquilino"}
                  </Menu.Item>
                  <Menu.Item key="close" onClick={onCloseSession}>
                    Cerrar Sesión
                  </Menu.Item>
                </Menu>
              )}
            >
              <Button type="ghost">
                <span>Opciones</span>
                <Icon type="down" />
              </Button>
            </Dropdown>
          ) : (
            <Button
              type={"ghost"}
              block={true}
              size="small"
              onClick={onCloseSession}
            >
              Cerrar Sesión
            </Button>
          )}
        </div>
      </Header>
    </>
  );
}
