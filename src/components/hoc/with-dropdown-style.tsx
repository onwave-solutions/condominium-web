import { ComponentType } from "react";
import styled from "styled-components";
import { palette } from "styled-theme";

function withDropDownStyle<T extends object>(ComponentName: ComponentType<T>) {
  return styled(ComponentName)`
    display: inline-block;

    &.ant-dropdown-button {
      &.ant-btn-group > .ant-btn:first-child:not(:last-child) {
        border-radius: ${(props: T) =>
          (props as any)["data-rtl"] === "rtl"
            ? "0 4px 4px 0"
            : "4px 0  0 4px"};
      }

      &.ant-btn-group > .ant-btn:last-child:not(:first-child) {
        border-radius: ${(props: T) =>
          (props as any)["data-rtl"] === "rtl" ? "4px 0 0 4px" : "0 4px 4px 0"};
      }

      &.ant-btn-group .ant-btn + .ant-btn {
        margin: ${(props: T) =>
          (props as any)["data-rtl"] === "rtl" ? "0 -1px 0 0" : "0 0 0 -1px"};
      }
    }

    .ant-dropdown-link {
      font-size: 13px;
      color: ${palette("primary", 0)};

      &:hover {
        color: ${palette("primary", 2)};
      }
    }
  `;
}

export default withDropDownStyle;
