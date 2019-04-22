import { ComponentType, FunctionComponent } from "react";
import styled from "styled-components";
import { palette } from "styled-theme";

function withDropdownMenuStyle<T extends object>(
  ComponentName: ComponentType<T>
) {
  return styled(ComponentName)`
    .ant-dropdown-menu-item {
      a {
        font-size: 13px;
        color: ${palette("text", 1)};
      }
    }

    .ant-dropdown-menu-item,
    .ant-dropdown-menu-submenu-title {
      a {
        font-size: 13px;
        color: ${palette("text", 1)};
      }

      &:hover {
        background-color: ${palette("secondary", 1)};
      }
    }
  `;
}

export default withDropdownMenuStyle;
