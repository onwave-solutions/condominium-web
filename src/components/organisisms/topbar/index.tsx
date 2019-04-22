import React from "react";
import Layout from "antd/lib/layout";

import Button from "../../atoms/button";
import Icon from "../../atoms/icon";
import Popover from "../../atoms/popover";
import TopbarDropdown from "../../molecules/topbar-dropdown";

const { Header } = Layout;

export interface ITopbar {
  collapsed?: boolean;
  onCollapsedChange?(value: boolean): void;
}

export default function Topbar(props: ITopbar) {
  const { collapsed, onCollapsedChange } = props;
  const styling = {
    // background: customizedTheme.backgroundColor,
    position: "fixed" as any,
    width: "100%",
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
          <Popover
            trigger="click"
            arrowPointAtCenter={true}
            placement="bottomLeft"
          >
            <Button type="ghost">
              <span>Seleccione un condominio</span>
              <Icon type="down" />
            </Button>
          </Popover>
        </div>
      </Header>
    </>
  );
}
