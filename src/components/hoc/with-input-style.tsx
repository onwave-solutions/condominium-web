import { ComponentType } from "react";
import styled from "styled-components";
import { palette } from "styled-theme";
import { borderRadius, transition } from "../../shared-ui/settings/style/utils";

function withInputStyle<T extends object>(ComponentName: ComponentType<T>) {
  return styled(ComponentName)`
    &.ant-input {
      padding: 4px 10px;
      width: 100% !important;
      height: 25px;
      cursor: text;
      text-align: ${(props: T) =>
        (props as any)["data-rtl"] === "rtl" ? "right" : "left"};
      font-size: 13px;
      line-height: 1.5;
      color: ${palette("text", 1)};
      background-color: #fff;
      background-image: none;
      border: 1px solid ${palette("border", 0)};
      ${borderRadius("1px")};
      ${transition()};

      &:focus {
        border-color: ${palette("primary", 0)};
      }

      &.ant-input-lg {
        height: 40px;
        padding: 6px 10px;
      }

      &.ant-input-sm {
        padding: 1px 10px;
        height: 25px;
      }

      &::-webkit-input-placeholder {
        text-align: ${(props: T) =>
          (props as any)["data-rtl"] === "rtl" ? "right" : "left"};
        color: ${palette("grayscale", 0)};
      }

      &:-moz-placeholder {
        text-align: ${(props: T) =>
          (props as any)["data-rtl"] === "rtl" ? "right" : "left"};
        color: ${palette("grayscale", 0)};
      }

      &::-moz-placeholder {
        text-align: ${(props: T) =>
          (props as any)["data-rtl"] === "rtl" ? "right" : "left"};
        color: ${palette("grayscale", 0)};
      }
      &:-ms-input-placeholder {
        text-align: ${(props: T) =>
          (props as any)["data-rtl"] === "rtl" ? "right" : "left"};
        color: ${palette("grayscale", 0)};
      }
    }
  `;
}

export default withInputStyle;
