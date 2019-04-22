import AntdInput, { InputProps } from "antd/lib/input";

import withInputStyle from "../../hoc/with-input-style";
import withDirection from "../../hoc/with-direction";

const Input = withDirection(withInputStyle(AntdInput));

Input.defaultProps = {
  size: "small"
} as InputProps;

export default Input;
