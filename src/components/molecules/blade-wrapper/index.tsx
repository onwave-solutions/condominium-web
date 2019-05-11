import React from "react";
import Layout from "antd/lib/layout";
import styled from "styled-components";
import { palette } from "styled-theme";

const { Header, Footer, Content } = Layout;

const Wrapper = styled(Layout)`
  min-width: 45%;
  max-width: 45%;
  height: 99%;
  margin-bottom: 3px;
  overflow: hidden;
  overflow-y: hidden;
  margin-right: 5px;
  margin-left: 2.5px;
  background: white;
  border-style: solid;
  border-width: 1px;
  border-color: #fafafa;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 3px;
  display: flex;
  flex-direction: column;

  @media (max-width: 800px) {
    min-width: 93%;
    max-width: 93%;
  }
`;

const InnerWrapper = styled(Content)`
  display: flex;
  width: 100%;
  background: white;
  flex-grow: 1;
  flex-direction: column;
  background: white;

  & .ps__rail-y {
    z-index: 999999;
  }
`;

const HeaderWrapper = styled(Header)`
  color: white !important;
  height: 3rem !important;
  display: flex;
  padding: 0px 0.5rem !important;
  line-height: 3rem !important;
  margin: 0 !important;
  background: #2d3446 !important;

  & h4 {
    color: white;
  }
`;

export interface IBladeProps {
  id?: string;
  header?: React.ReactNode;
  children?: React.ReactNode;
}

export default function BladeWrapper(props: IBladeProps) {
  const { children, header, id } = props;
  return (
    <Wrapper id={id}>
      <HeaderWrapper>{header}</HeaderWrapper>
      <InnerWrapper>{children}</InnerWrapper>
    </Wrapper>
  );
}
