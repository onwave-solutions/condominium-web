import React, { useContext } from "react";
import SelectComp, { SelectProps } from "antd/lib/select";

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
      onChange(item, option);
    }
    if (!onChangeItem) return;
    onChangeItem(name!, item);
  };
  return (
    <SelectComp
      id={name}
      value={value}
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
