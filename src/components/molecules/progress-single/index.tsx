import React from "react";
import Progress from "../../atoms/progress";
import { SingleProgressWidgetBar } from "./style";

export interface ISingleProgressWidget {
  label?: string;
  percent?: number;
  barHeight?: number;
  status?: any;
  info?: boolean;
  format?: any;
  fontColor?: string;
}

const SingleProgressWidget: React.FC<ISingleProgressWidget> = ({
  label,
  percent,
  format,
  barHeight,
  status,
  info,
  fontColor
}) => {
  return (
    <SingleProgressWidgetBar className="isoSingleProgressBar">
      <h3 style={{ color: fontColor }}>{label}</h3>
      <Progress
        percent={percent}
        format={format}
        strokeWidth={barHeight}
        status={status}
        showInfo={info}
      />
    </SingleProgressWidgetBar>
  );
};

export default SingleProgressWidget;
