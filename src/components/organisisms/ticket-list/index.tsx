import React, { useState, useEffect } from "react";
import moment from "moment";
import { NoteListWrapper } from "../../molecules/ticket-wrapper";
import InputSearch from "../../molecules/input-search";
import Button from "../../atoms/button";
import { Ticket } from "../../../shared-ui/models/ticket.model";
import Select from "../../atoms/select";
import { Keylist, IQuery } from "../../../shared-ui/models/keylist";

export interface ITicketList {
  tickets?: Ticket[];
  onQueryChange?: (query: IQuery) => void;
  onTicketClicked?: (ticket: Ticket) => void;
  keylist: Keylist;
  selectedId?: number;
}

let timeout: any;

export default function TicketList({
  tickets,
  selectedId,
  keylist,
  onQueryChange,
  onTicketClicked
}: ITicketList) {
  const [query, setQuery] = useState<IQuery>({ query: "", state: "ES" });
  const handleQueryChange = (key: keyof IQuery) => {
    return (value: string) => {
      const newQuery = { ...query, [key]: value };
      setQuery(newQuery);
      clearTimeout(timeout);
      timeout = setTimeout(() => onQueryChange!(newQuery), 800);
    };
  };

  useEffect(() => {
    onQueryChange!(query);
  }, []);
  return (
    <NoteListWrapper className="isoNoteListWrapper">
      <InputSearch
        placeholder="Buscar Ticket"
        className="isoSearchNotes"
        value={query.query}
        onChange={({ target }) => handleQueryChange("query")(target.value)}
      />
      <Select
        data={keylist.ticketStatus}
        placeholder="Estado"
        value={query.state}
        onChange={value => handleQueryChange("state")(value as string)}
      />
      <div className="isoNoteList">
        {tickets && tickets.length ? (
          tickets.map(TicketItem({ selectedId, onTicketClicked }))
        ) : (
          <span className="isoNoResultMsg">Tickets no encontrados</span>
        )}
      </div>
    </NoteListWrapper>
  );
}

function TicketItem({ selectedId, onTicketClicked }: any) {
  return (ticket: Ticket) => {
    const activeClass = selectedId === ticket.id ? "active" : "";
    return (
      <div
        className={`isoList ${activeClass}`}
        key={ticket.id}
        onClick={() => onTicketClicked(ticket)}
      >
        <div className="isoNoteBGColor" style={{ width: "5px" }} />
        <div className="isoNoteText">
          <h3>{ticket.title}</h3>
          <span className="isoNoteCreatedDate">
            {moment(ticket.createdAt).format("DD/MMM/YYYY hh:mm:ss a")}
          </span>
        </div>
      </div>
    );
  };
}
