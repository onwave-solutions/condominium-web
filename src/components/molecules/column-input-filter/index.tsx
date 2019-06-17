import React from "react";
import Input from "../../atoms/input";
import Button from "../../atoms/button";

export interface IColumnInputFilter {
  selectedKeys?: string[];
  handleSearch?(keys: string[], confirm: Function): void;
  confirm?: Function;
  handleReset?(cb: Function): void;
  clearFilters?: Function;
  setSelectedKeys?(keys: string[]): void;
}

export default function ColumnInputFilter(props: IColumnInputFilter) {
  const {
    selectedKeys,
    setSelectedKeys,
    confirm,
    handleSearch,
    clearFilters,
    handleReset
  } = props;

  return (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Buscar`}
        value={selectedKeys![0]}
        onChange={e => setSelectedKeys!(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch!(selectedKeys!, confirm!)}
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
