import { Input } from "antd";
import withDirection from "../../hoc/with-direction";
import InputSearchWrapper from "./styles";

const { Search } = Input;

const WDInputSearch = InputSearchWrapper(Search);
export default withDirection(WDInputSearch);
