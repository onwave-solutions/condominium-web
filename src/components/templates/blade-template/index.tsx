import React from "react";
import styled from "styled-components";

import Row from "../../atoms/row";

export const Wrapper = styled(Row)`
  padding: 10px;
  margin: 0;
  display: flex;
  overflow: hidden;
  overflow-y: auto;
  flex-direction: column;
  flex-grow: 1;
  flex: 1;
`;

export const HeaderWrapper = styled.header`
  height: 35px;
  max-height: 35px;
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 2.5px;
  padding-right: 10px;
  padding-left: 10px;
  border-style: solid;
  border-width: 0;
  position: sticky;
  top: 0px;
  border-color: #eaeaea;
  border-bottom-width: 1px;
  background: white;
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
  background: white;
`;

export interface IBladeTemplate {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function BladeTemplate(props: IBladeTemplate) {
  const { children, header, footer } = props;
  return (
    <>
      <HeaderWrapper>{header}</HeaderWrapper>
      <Wrapper>{children}</Wrapper>
      <FooterWrapper>{footer}</FooterWrapper>
    </>
  );
}
