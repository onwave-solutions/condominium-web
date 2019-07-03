import React, { useContext } from "react";
import SelectComp, {
  AutoCompleteProps as SelectProps
} from "antd/lib/auto-complete";

import withInputStyle from "../../hoc/with-input-style";
import withDirection from "../../hoc/with-direction";

import { KeyOf } from "../../../shared-ui/utils/objects";
import { InputChangeValue } from "../../../shared-ui/utils/input";

export type ISelect = SelectProps & {
  typeName?: string;
  labelName?: string;
  data?: any[];
  name?: string;
  children?: React.ReactNode;
  onChangeItem?: InputChangeValue;
  renderNode?: (data: any) => React.ReactNode;
};

let component: any;

function Select(props: ISelect) {
  const {
    value,
    name,
    data,
    typeName,
    labelName,
    onChangeItem,
    renderNode,
    onChange,
    children,
    ...selectProps
  } = props;

  const handleItemSelect = (item: any, option: any) => {
    if (onChange) {
      onChange(item);
    }
    if (!onChangeItem) return;
    onChangeItem(name!, item);
  };

  const handleBlur = () => {
    const val = data!.find(item => item[typeName!] === value);
    if (val) return;
    if (!onChangeItem) return;
    onChangeItem(name!, undefined);
  };

  return (
    <SelectComp
      value={value}
      showSearch={true}
      showArrow={false}
      onBlur={handleBlur}
      onChange={handleItemSelect as any}
      {...selectProps}
    >
      {children ||
        data!.map(item => (
          <SelectComp.Option
            disabled={(item as any).disabled}
            value={(item[typeName!] as any) as string}
            key={item[typeName!] as any}
          >
            {renderNode ? renderNode(item) : item[labelName!]}
          </SelectComp.Option>
        ))}
    </SelectComp>
  );
}

export const Option = SelectComp.Option;

export default withDirection(withInputStyle(Select));

Select.defaultProps = {
  showSearch: true,
  typeName: "type",
  labelName: "name",
  data: []
} as ISelect;
