import React from "react";
import Layout from "antd/lib/layout";
import styled from "styled-components";
import { palette } from "styled-theme";

const { Content } = Layout;

const Wrapper = styled(Layout)`
  min-width: 100%;
  max-width: 100%
  widht: 100%;
  height: 99%;
  min-height: 99%;
  transition: 0.3s;
  display: flex;
  flex-direction: column;

 `;

const InnerWrapper = styled(Content)`
  display: flex;
  width: 100%;
  flex-grow: 1;
  flex-direction: column;

  & .ps__rail-y {
    z-index: 999999;
  }
`;

//const HeaderWrapper = styled(Header)`
//  color: white !important;
//  height: 3rem !important;
//  display: flex;
//  padding: 0px 0.5rem !important;
//  line-height: 3rem !important;
//  margin: 0 !important;
//  background: #2d3446 !important;
//
//  & h4 {
//    color: white;
//  }
//`;

export interface IBladeProps {
  id?: string;
  header?: React.ReactNode;
  children?: React.ReactNode;
  size?: "large" | "normal";
}

export default function BladeWrapper(props: IBladeProps) {
  const { children, id } = props;
  return (
    <Wrapper id={id}>
      <InnerWrapper>{children}</InnerWrapper>
    </Wrapper>
  );
}
