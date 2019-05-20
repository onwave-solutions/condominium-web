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
    ...selectProps
  } = props;

  const handleItemSelect = (item: any) => {
    if (!onChangeItem) return;
    onChangeItem(name!, item);
  };
  return (
    <SelectComp
      size="small"
      id={name}
      value={value}
      onChange={handleItemSelect as any}
      {...selectProps}
    >
      {data!.map(item => (
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

export default withDirection(withInputStyle(Select));

Select.defaultProps = {
  showSearch: true,
  typeName: "type",
  labelName: "name",
  data: []
} as ISelect;
