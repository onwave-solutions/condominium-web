import React from "react";
import Select from "../../atoms/select";
import Button from "../../atoms/button";
import { ISelect } from "../../atoms/select";

export interface IColumnSelectFilter {
  selectedKeys?: string[];
  handleSearch?(keys: string[], confirm: Function): void;
  confirm?: Function;
  data?: any[];
  handleReset?(cb: Function): void;
  clearFilters?: Function;
  setSelectedKeys?(keys: string[]): void;
  selectProps: ISelect;
}

export default function ColumnSelectFilter(props: IColumnSelectFilter) {
  const {
    selectedKeys,
    setSelectedKeys,
    data,
    confirm,
    handleSearch,
    clearFilters,
    handleReset,
    selectProps
  } = props;

  return (
    <div style={{ padding: 8 }}>
      <Select
        placeholder={`Buscar`}
        data={data}
        value={selectedKeys![0]}
        onChangeItem={(_: string, value: any) => {
          const selected = value ? [value] : [];
          setSelectedKeys!(selected);
          handleSearch!(selected!, confirm!);
          console.log(selected);
        }}
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
      <Button
        type="primary"
        onClick={() => confirm!()}
        icon="search"
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        Buscar
      </Button>
      <Button
        onClick={() => handleReset!(clearFilters!)}
        size="small"
        style={{ width: 90 }}
      >
        Limpiar
      </Button>
    </div>
  );
}
