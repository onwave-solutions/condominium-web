import React from "react";
import { VCardWidgetWrapper } from "./style";

export interface ICardWidget {
  title?: string;
  subTitle?: string;
  description?: string;
  style?: React.CSSProperties;
}

const CardWidget: React.FC<ICardWidget> = ({
  title,
  subTitle,
  description,
  children,
  style
}) => {
  return (
    <VCardWidgetWrapper className="isoVCardWidgetWrapper" style={style}>
      <div className="isoVCardBody">
        <h3 className="isoName">{title}</h3>
        <span className="isoDesgTitle">{subTitle}</span>
        <p className="isoDescription">{description}</p>
        <div className="isoWidgetSocial">{children}</div>
      </div>
    </VCardWidgetWrapper>
  );
};

export default CardWidget
