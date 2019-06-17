import React, { useState } from "react";
import _ from "lodash";
import { User } from "../../../shared-ui/models/user";
import InputSearch from "../../molecules/input-search";
import Scrollbar from "../../atoms/scrollbar";
import { ContactListWrapper } from "./style";

export interface ITenantContactList {
  users: User[];
  onSelect?(user: User): void;
  selectedId?: number;
}

export default function TenantContactList({
  users,
  onSelect,
  selectedId
}: ITenantContactList) {
  const [query, setQuery] = useState<string>("");
  return (
    <ContactListWrapper>
      <InputSearch
        placeholder="Buscar Inquilino"
        className="isoSearchBar"
        value={query}
        onChange={({ target }) => setQuery(target.value)}
      />
      {users && users.length ? (
        <div className="isoContactList">
          <Scrollbar className="contactListScrollbar">
            {_.sortBy(users, "lastName").map(user => {
              const activeClass = selectedId === user.id ? "active" : "";
              return (
                <div
                  key={user.id}
                  onClick={() => onSelect!(user)}
                  className={`${activeClass} isoSingleContact`}
                >
                  <div className="isoAvatar" />
                  <div className="isoContactName">
                    <h3>
                      {user.name} {user.lastName}
                    </h3>
                  </div>
                </div>
              );
            })}
          </Scrollbar>
        </div>
      ) : (
        <span className="isoNoResultMsg">No se ha encontrado Inquilinos</span>
      )}
    </ContactListWrapper>
  );
}
