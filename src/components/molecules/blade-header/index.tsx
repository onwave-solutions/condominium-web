import React from "react";

import Icon from "../../atoms/icon";

export interface IBladeHeader {
  title?: string;
  onClose?(): void;
}

export default function BladeHeader(props: IBladeHeader) {
  const { title, onClose } = props;
  return (
    <>
      <h4>{title}</h4>
      <div style={{ flex: 1 }} />
      <Icon type="close" onClick={onClose} style={{ marginTop: 10 }} />
    </>
  );
}
