import React from "react";
import { ReportWidgetWrapper } from "./style";

export interface IReportWidget {
  label?: string;
  details?: string;
}

const ReportWidget: React.FC<IReportWidget> = ({
  label,
  details,
  children
}) => {
  return (
    <ReportWidgetWrapper className="isoReportsWidget">
      <h3 className="isoWidgetLabel">{label}</h3>

      <div className="isoReportsWidgetBar">{children}</div>

      <p className="isoDescription">{details}</p>
    </ReportWidgetWrapper>
  );
};

export default ReportWidget;
