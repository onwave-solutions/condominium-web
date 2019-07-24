import React from "react";
import { SaleWidgetWrapper } from "./style";

export interface ISalesWidget {
  fontColor?: string;
  label?: string;
  price?: number | string;
  details?: string;
}

const SalesWidget: React.FC<ISalesWidget> = ({
  fontColor,
  label,
  price,
  details
}) => {
  const textColor = {
    color: fontColor
  };

  return (
    <SaleWidgetWrapper className="isoSaleWidget">
      <h3 className="isoSaleLabel">{label}</h3>
      <span className="isoSalePrice" style={textColor}>
        {price}
      </span>
      <p className="isoSaleDetails">{details}</p>
    </SaleWidgetWrapper>
  );
};

export default SalesWidget;
