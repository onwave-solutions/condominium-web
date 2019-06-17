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
  onBladePress?(key: string): void;
}

export default function Sidebar(props: ISidebar) {
  const { modules, collapsed, onBladePress } = props;
  const styling = {
    // backgroundcolor: customizedtheme.backgroundcolor
  };
  const submenucolor = {
    // color: customizedtheme.textcolor
  };
  return (
    <Sider
      trigger={null}
      collapsible={true}
      collapsed={collapsed}
      width={240}
      className="isomorphicSidebar"
      // onMouseEnter={onMouseEnter}
      // onMouseLeave={onMouseLeave}
      style={styling}
    >
      <Logo collapsed={collapsed!} />
      <Scrollbar style={{ height: "calc(100vh - 70px)" }}>
        <Menu
          theme="dark"
          className="isoDashboardMenu"
          mode="inline"
          onClick={params => onBladePress && onBladePress(params.key)}
        >
          {modules.map(MenuItem)}
        </Menu>
      </Scrollbar>
    </Sider>
  );
}

function MenuTitle(props: IModule) {
  const { iconType, title, children } = props;
  return (
    <span className="isoMenuHolder">
      <i className="ion-android-options" />
      <span className="nav-text">{title}</span>
    </span>
  );
}

function MenuItem(props: IModule) {
  const { children, iconType, id, route, title, ...otherProps } = props;
  if (children && children.length) return <SubMenuItem key={id} {...props} />;
  return (
    <Item {...otherProps} key={id} title={title}>
      <span className="isoMenuHolder">
        <i className={iconType} />
        <span className="nav-text">{title}</span>
      </span>
    </Item>
  );
}

function SubMenuItem(props: IModule) {
  const submenuStyle = {
    backgroundColor: "rgba(0,0,0,0.3)"
    // color: customizedtheme.textcolor
  };
  const { children, iconType, id, route, title, ...otherProps } = props;

  return (
    <SubMenu {...otherProps} key={route} title={<MenuTitle {...props} />}>
      {children.map(item => {
        return (
          <Item style={submenuStyle} key={item.id}>
            {item.title}
          </Item>
        );
      })}
    </SubMenu>
  );
}

Sidebar.defaultProps = {
  modules: []
} as ISidebar;
