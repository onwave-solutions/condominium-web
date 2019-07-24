import { ComponentType } from "react";
import Button, { ButtonProps } from "antd/lib/button";
import styled from "styled-components";
import withButtonStyle from "../../hoc/with-button-style";

export default withButtonStyle(Button as any) as ComponentType<
  Partial<ButtonProps>
>;

export const ButtonGroup = Button.Group
