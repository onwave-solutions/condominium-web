import React, { forwardRef } from "react";
import AntdInput, { InputProps } from "antd/lib/input";

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
    return <Input {...this.props} />;
  }
}
