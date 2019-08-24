import React, { forwardRef } from "react";
import AntdInput, { InputProps } from "antd/lib/input";

import "./input.css";

import withInputStyle from "../../hoc/with-input-style";
import withDirection from "../../hoc/with-direction";

const Input = withDirection(withInputStyle(AntdInput));

Input.defaultProps = {} as InputProps;

export const InputArea = AntdInput.TextArea;

//export default forwardRef((props: InputProps, ref: any) => {
//  return <Input {...props as any} ref={ref as any} />;
//});

export default class extends React.Component<InputProps, any> {
  render() {
    const { type: defType, value: defVal = "", ...props } = this.props;

    let value = defVal;
    let type = defType;
    if (type === "number") {
      value = `${defVal || ""}`.replace(/\D/g, "");
      type = "";
    }
    return <Input {...props} type={type} value={value} autoComplete="off" />;
  }
}
