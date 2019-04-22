import React from "react";
import styled from "styled-components";

const ShellContentWrapper = styled.div`
  padding: 5px;
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  overflow-x: scroll;

  @media only screen and (max-width: 767px) {
    padding: 5px;
  }

  @media (max-width: 580px) {
    padding: 5px;
  }
`;

export interface IShellWrapper {
  children?: React.ReactNode;
  className?: string;
}
export default function ShellWrapper(props: IShellWrapper) {
  const { children, className } = props;
  const cs = `${className || ""} isolayoutContentWrapper`;
  return <ShellContentWrapper className={cs}>{children}</ShellContentWrapper>;
}
