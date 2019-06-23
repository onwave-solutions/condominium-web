import React, { useState, useEffect } from "react";
import _ from "lodash";
import { NoteListWrapper } from "../../molecules/ticket-wrapper";
import InputSearch from "../../molecules/input-search";
import { KeyOf } from "../../../shared-ui/utils/objects";

export interface ISideList<T> {
  items: T[];
  resetId: string | number;
  filterKeys?: KeyOf<T>[];
  children: (item: T) => React.ReactNode;
}

export default function SideList<T>({
  items,
  resetId,
  children,
  filterKeys
}: ISideList<T>) {
  const [query, setQuery] = useState<string>("");
  const [list, setList] = useState<T[]>(items);
  const handleQueryChange = (query: string) => {
    setQuery(query);
    if (!filterKeys || !filterKeys.length) return;
    if (!query) setList(items);
    else
      setList(
        items.filter(item => {
          return filterKeys.reduce<boolean>((acc, key) => {
            const value = _.get(item, key);
            switch (typeof value) {
              case "string":
                return (
                  acc || value.toUpperCase().startsWith(query.toUpperCase())
                );
              case "number":
                return acc || value === parseInt(query, 10);
              default:
            }
            return acc;
          }, false);
        })
      );
  };

  useEffect(() => {
    setList(items);
    handleQueryChange(query);
  }, [items]);

  useEffect(() => {
    handleQueryChange("");
  }, [resetId]);
  return (
    <NoteListWrapper className="isoNoteListWrapper">
      <InputSearch
        placeholder="Buscar"
        className="isoSearchNotes"
        value={query}
        onChange={({ target }) => handleQueryChange(target.value)}
      />
      <div className="isoNoteList">
        {list && list.length ? (
          list.map(children)
        ) : (
          <span className="isoNoResultMsg">No encontrado</span>
        )}
      </div>
    </NoteListWrapper>
  );
}
