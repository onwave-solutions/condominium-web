import React from "react";
import Select from "../../atoms/select";
import Button from "../../atoms/button";

export interface IColumnSelectFilter {
  selectedKeys?: string[];
  handleSearch?(keys: string[], confirm: Function): void;
  confirm?: Function;
  data?: any[];
  handleReset?(cb: Function): void;
  clearFilters?: Function;
  setSelectedKeys?(keys: string[]): void;
}

export default function ColumnSelectFilter(props: IColumnSelectFilter) {
  const {
    selectedKeys,
    setSelectedKeys,
    data,
    confirm,
    handleSearch,
    clearFilters,
    handleReset
  } = props;

  return (
    <div style={{ padding: 8 }}>
      <Select
        placeholder={`Buscar`}
        data={data}
        value={selectedKeys![0]}
        onChangeItem={(_: string, value: any) => {
          setSelectedKeys!(value ? [value] : []);
          handleSearch!(selectedKeys!, confirm!);
        }}
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
      <Button
        type="primary"
        onClick={() => handleSearch!(selectedKeys!, confirm!)}
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
