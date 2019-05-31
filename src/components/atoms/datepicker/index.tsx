import DatePicker from "antd/lib/date-picker";
import withDatepickerStyle from "./datepicker.styles";

const Datepicker = withDatepickerStyle(DatePicker);
const DateRangepicker = withDatepickerStyle(DatePicker.RangePicker);

export default Datepicker;
export { DateRangepicker };
