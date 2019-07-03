import React from "react";
import { BoxTitle, BoxSubTitle } from "./style";

export interface IBoxTitle {
  title?: string;
  subtitle?: string;
}

export default (props: IBoxTitle) => {
  return (
    <div>
      {props.title ? (
        <BoxTitle className="isoBoxTitle"> {props.title} </BoxTitle>
      ) : (
        ""
      )}
      {props.subtitle ? (
        <BoxSubTitle className="isoBoxSubTitle"> {props.subtitle} </BoxSubTitle>
      ) : (
        ""
      )}
    </div>
  );
};
