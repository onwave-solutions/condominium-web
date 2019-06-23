import React from "react";
import { Spin } from "antd";
import styled from "styled-components";

import { select } from "../../../shared-ui/store/selectors";
import { appSelector } from "../../../shared-ui/store/selectors/app";
import { useReduxState } from "../../../shared-ui/store/hooks";

const LayoutContentWrapper = styled.div`
  height: 100%;
  & .ant-spin-nested-loading {
    height: 100% !important;
  }
  & .ant-spin-container {
    height: 100% !important;
  }
`;

const appState = select(appSelector);

export default function WrapperTemplate({ children }: any) {
  const loading = useReduxState(appState("loading"));
  return (
    <LayoutContentWrapper>
      <Spin tip="Cargando Favor Espere..." spinning={loading}>
        {children}
      </Spin>
    </LayoutContentWrapper>
  );
}
