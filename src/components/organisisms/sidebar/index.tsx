import React, { createContext, useContext } from "react";
import Layout from "antd/lib/layout";

import Logo from "../../molecules/logo";
import Icon from "../../atoms/icon";
import Scrollbar from "../../atoms/scrollbar";
import Menu from "../../atoms/menu";
import { IModule } from "../../../shared-ui/models/module";

const { SubMenu, ItemGroup, Item } = Menu;

const { Sider } = Layout;

export interface ISidebar {
  modules: IModule[];
  collapsed?: boolean;
  onBladePress?(mod: IModule): void;
}

const SideContext = createContext<Partial<ISidebar>>({});

export default function Sidebar(props: ISidebar) {
  const { modules, collapsed } = props;
  const styling = {
    // backgroundcolor: customizedtheme.backgroundcolor
  };
  const submenustyle = {
    backgroundcolor: "rgba(0,0,0,0.3)"
    // color: customizedtheme.textcolor
  };
  const submenucolor = {
    // color: customizedtheme.textcolor
  };
  return (
    <Sider
      trigger={null}
      collapsible={true}
      collapsed={collapsed}
      width={210}
      className="isomorphicSidebar"
      // onMouseEnter={onMouseEnter}
      // onMouseLeave={onMouseLeave}
      style={styling}
    >
      <Logo collapsed={collapsed!} />
      <Scrollbar style={{ height: "calc(100vh - 70px)" }}>
        <SideContext.Provider value={props}>
          <Menu theme="dark" className="isoDashboardMenu">
            {modules.map(MenuItem)}
          </Menu>
        </SideContext.Provider>
      </Scrollbar>
    </Sider>
  );
}

function MenuTitle(props: IModule) {
  const { iconType, title, children } = props;
  const { onBladePress } = useContext(SideContext);
  return (
    <span
      className="isoMenuHolder"
      onClick={() =>
        (!children || !children.length) && onBladePress && onBladePress(props)
      }
    >
      {iconType && <Icon type={iconType} />}
      <span className="nav-text">{title}</span>
    </span>
  );
}

function MenuItem(props: IModule) {
  const { children, iconType, id, route, title, ...otherProps } = props;
  if (children && children.length) return <SubMenuItem {...props} />;
  return (
    <Item {...otherProps} key={id} title={title}>
      <MenuTitle {...props} />
    </Item>
  );
}

function SubMenuItem(props: IModule) {
  const { children, iconType, id, route, title, ...otherProps } = props;
  return (
    <SubMenu {...otherProps} key={id} title={<MenuTitle {...props} />}>
      {children.map(MenuItem)}
    </SubMenu>
  );
}

Sidebar.defaultProps = {
  modules: []
} as ISidebar;
