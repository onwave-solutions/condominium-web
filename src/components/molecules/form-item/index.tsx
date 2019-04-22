import React from "react";
import styled from "styled-components";

import Col from "../../atoms/col";

export interface IFormItem {
  sm?: number;
  md?: number;
  label?: string;
  children?: React.ReactNode;
}

const Wrapper = styled(Col)`
  padding-left: 0.2rem !important;
  padding-right: 0.2rem !important;
  margin-bottom: 0.2rem !important;
`;

export default function FormItem(props: IFormItem) {
  const { sm, md, label, children } = props;
  return (
    <Wrapper sm={sm} md={md}>
      <label>{label}:</label>
      {children}
    </Wrapper>
  );
}

FormItem.defaultProps = {
  sm: 24,
  md: 12
} as IFormItem;
