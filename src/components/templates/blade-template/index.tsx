import React from "react";
import { Spin } from "antd";
import styled from "styled-components";

import Row from "../../atoms/row";
import { select } from "../../../shared-ui/store/selectors";
import { appSelector } from "../../../shared-ui/store/selectors/app";
import { useReduxState } from "../../../shared-ui/store/hooks";

const LayoutContentWrapper = styled(Row)`
  padding: 40px 20px 0px 20px;
  display: flex;
  width: 100% !important;
  flex: 1;
  flex-flow: row wrap;
  overflow: hidden;

  @media only screen and (max-width: 767px) {
    padding: 50px 20px 0px 20px;
  }

  @media (max-width: 580px) {
    padding: 15px;
  }
  & .ant-spin-nested-loading {
    height: 100% !important;
    width: 100% !important;
  }
  & .ant-spin-container {
    height: 100% !important;
    width: 100% !important;
  }

  & tr:nth-child(even) {
    background: #f7f7f7;
  }

  & tr:nth-child(odd) {
    background: white;
  }
`;

export const Wrapper = styled(Row)`
  padding: 10px;
  flex-grow: 1;
  height: 100% !important;
  overflow: hidden;
  background: white;
  flex: 1;
  overflow-y: auto;
`;

export const HeaderWrapper = styled.header`
  height: 70px;
  background: white;
  max-height: 70px;
  min-height: 70px;
  display: flex;
  overflow: hidden;
  overflow-x: auto;
  align-items: center;
  flex-direction: row;
  width: 100%;
  padding: 10px;
  border-style: solid;
  border-width: 0;
  border-color: #eaeaea;
  background: white;
  border-bottom-width: 1px;
`;

export const FooterWrapper = styled.footer`
  height: 35px;
  z-index: 10;
  flex-direction: row;
  width: 100%;
  padding: 2.5px;
  padding-right: 10px;
  padding-left: 10px;
  border-style: solid;
  border-width: 0;
  border-color: #eaeaea;
  border-top-width: 1px;
  margin-top: 5px;
`;

export interface IBladeTemplate {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const appState = select(appSelector);

export default function BladeTemplate(props: IBladeTemplate) {
  const { children, header } = props;
  const loading = useReduxState(appState("loading"));
  return (
    <LayoutContentWrapper className="isoLayoutContentWrapper">
      <Spin tip="Cargando Favor Espere..." spinning={loading}>
        {header && <HeaderWrapper>{header}</HeaderWrapper>}
        <Wrapper>{children}</Wrapper>
      </Spin>
      {/* <FooterWrapper>{footer}</FooterWrapper> */}
    </LayoutContentWrapper>
  );
}
