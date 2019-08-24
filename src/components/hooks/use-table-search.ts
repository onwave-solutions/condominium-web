import { useState } from "react";

export interface IUseSearch {}

export default function useSearch() {
  const [searchText, setSearchText] = useState("");
  const onFilter = (fn: (record: any) => any) => (value: any, record: any) =>
    fn(record)
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase());

  const handleSearch = (selectedKeys: string[], confirm: Function) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters: Function) => {
    clearFilters();
    setSearchText("");
  };

  return { searchText, onFilter, handleSearch, handleReset };
}
