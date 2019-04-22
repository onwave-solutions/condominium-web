import React from "react";
import SmoothScrollbar, { ScrollbarProps } from "react-smooth-scrollbar";

export interface IScrollbar extends ScrollbarProps {
  children?: React.ReactNode;
}

export default function Scrollbar(props: IScrollbar) {
  const { children, ...scrollProps } = props;
  return <SmoothScrollbar {...scrollProps}>{children}</SmoothScrollbar>;
}

Scrollbar.defaultProps = {
  continuousScrolling: true
} as IScrollbar;
