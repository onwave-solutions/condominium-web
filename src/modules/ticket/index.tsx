import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Layout } from "antd";
import TicketWrapper from "../../components/molecules/ticket-wrapper";
import Button from "../../components/atoms/button";
import Scrollbar from "../../components/atoms/scrollbar";
import { IModule } from "../../shared-ui/models/module";
import { InputArea } from "../../components/atoms/input";
import TicketList from "../../components/organisisms/ticket-list";
import { select } from "../../shared-ui/store/selectors";
import { managerSelector } from "../../shared-ui/store/selectors/manager.selector";
import { useReduxState, useReduxAction } from "../../shared-ui/store/hooks";
import { ticketSelector } from "../../shared-ui/store/selectors/ticket.selector";
import {
  loadTicketByCondominiumAction,
  createTicketAction,
  loadTicketsByQuery,
  addCommentAction,
  updateTicketAction
} from "../../shared-ui/store/actions/ticket.action";
import TicketCreateForm from "../../components/organisisms/ticket-create-form";
import { Ticket } from "../../shared-ui/models/ticket.model";
import Comment from "../../components/molecules/comment";
import { appSelector } from "../../shared-ui/store/selectors/app";
import { IQuery, AdvanceQuery } from "../../shared-ui/models/keylist";
import CommentList from "../../components/molecules/comment-list";
import WrapperTemplate from "../../components/templates/wrapper-template";
import { tenantSelector } from "../../shared-ui/store/selectors/tenant.selector";

const { Header, Content, Footer } = Layout;

const managerState = select(managerSelector);
const tenantState = select(tenantSelector);
const ticketState = select(ticketSelector);
const appState = select(appSelector);

function buildQuery(condominiumId: number, apartmentId?: number) {
  return ({ state, query }: IQuery): Partial<AdvanceQuery<Ticket>>[] => {
    if (!condominiumId) return [];
    const base: Partial<Ticket> = {
      condominiumId,
      statusType: state,
      apartmentId
    };
    if (!query) return [base];
    return [
      { ...base, description: { like: query }, apartmentId },
      { ...base, solution: query.toUpperCase(), apartmentId },
      { ...base, title: { like: query }, apartmentId }
    ];
  };
}

export default function TicketView(props: IModule) {
  const [query, setQuery] = useState<IQuery>({});
  const condominium = useReduxState(managerState("condominium"));
  const apartment = useReduxState(tenantState("apartment"));
  const keylist = useReduxState(appState("keylist"));
  const tickets = useReduxState(ticketState("tickets"));
  const [ticket, setTicket] = useState<Ticket>({});
  const [createTicketVisible, setCreateTicketVisible] = useState<boolean>(
    false
  );

  const condominiumId =
    _.get(condominium, "id") || _.get(apartment, "building.condominium.id");
  const queryBuilder = buildQuery(condominiumId!, apartment.id);

  const onCreateTicket = useReduxAction(createTicketAction(props.id));
  const onUpdateTicket = useReduxAction(updateTicketAction(props.id));
  const onAddComment = useReduxAction(addCommentAction(props.id, ticket.id));

  const loadTickets = useReduxAction(loadTicketsByQuery(props.id));
  const handleCreateTicketModal = (status: boolean) => {
    return () => setCreateTicketVisible(status);
  };

  const onCb = (ticket: Ticket) => {
    setTicket(ticket);
    loadTickets(queryBuilder(query));
  };

  const handleCreateTicket = async (ticket: Ticket) => {
    if (apartment.id) {
      ticket.apartmentId = apartment.id;
      if (!ticket.apartmentKeys || !ticket.apartmentKeys.length) {
        ticket.apartmentKeys = [`${apartment.building!.id}-${apartment.id}`];
      }
    }
    await onCreateTicket({ ...ticket, condominiumId }, onCb);
    handleCreateTicketModal(false)();
  };

  const handleQueryChange = (q: IQuery) => {
    setQuery(q);
    loadTickets(queryBuilder(q));
  };

  const handleAddComment = (comment: string) => {
    onAddComment(comment, onCb);
  };

  const handleUpdateTicket = (newTicket: Ticket) => () => {
    onUpdateTicket(newTicket, ticket => {
      setTicket(ticket);
      loadTickets(queryBuilder(query));
    });
  };

  useEffect(() => {
    if (!query.state) return;
    loadTickets(queryBuilder(query));
  }, [condominiumId]);
  return (
    <>
      <TicketCreateForm
        visible={createTicketVisible}
        condominiumId={condominiumId}
        buildingId={apartment.id ? apartment.building!.id! : undefined}
        isTenant={Boolean(apartment.id)}
        onCreate={handleCreateTicket}
        onClose={handleCreateTicketModal(false)}
      />
      <WrapperTemplate>
        <TicketWrapper className="isomorphicNoteComponent">
          <div style={{ width: "320px" }} className="isoNoteListSidebar">
            <TicketList
              tickets={tickets}
              keylist={keylist}
              onQueryChange={handleQueryChange}
              selectedId={ticket.id}
              onTicketClicked={setTicket}
            />
          </div>
          <Layout className="isoNotepadWrapper">
            <Header className="isoHeader">
              <div style={{ flex: 1 }} />
              <>
                <Button
                  type="primary"
                  className="isoAddNoteBtn"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={handleCreateTicketModal(true)}
                >
                  Crear Ticket
                </Button>
              </>
              {ticket.id && (
                <>
                  {!["CA", "RE"].includes(ticket.statusType!) && !apartment.id && (
                    <Button
                      type="danger"
                      style={{ marginLeft: "0.5rem" }}
                      onClick={handleUpdateTicket({
                        ...ticket,
                        statusType: "CA"
                      })}
                    >
                      Cancelar Ticket
                    </Button>
                  )}
                </>
              )}
              {["ES", "PA"].includes(ticket.statusType!) && !apartment.id && (
                <Button
                  type="primary"
                  className="isoAddNoteBtn"
                  onClick={handleUpdateTicket({ ...ticket, statusType: "TR" })}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Empezar a Trabajar
                </Button>
              )}
              {ticket.statusType === "TR" && !apartment.id && (
                <Button
                  type="ghost"
                  onClick={handleUpdateTicket({ ...ticket, statusType: "RE" })}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Resolver
                </Button>
              )}
              {ticket.statusType === "TR" && !apartment.id && (
                <Button
                  type="default"
                  onClick={handleUpdateTicket({ ...ticket, statusType: "PA" })}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Pausar
                </Button>
              )}
            </Header>
            {ticket.id && (
              <>
                <Content
                  style={{
                    padding: "3rem",
                    paddingBottom: "0",
                    flexDirection: "column"
                  }}
                  className="isoNoteEditingArea"
                >
                  <div
                    className="isoColorChooseWrapper"
                    style={{ marginBottom: "0.7rem" }}
                  >
                    <h2 style={{ marginRight: "0.7rem" }}>{ticket.title}</h2>
                    <span>Estado: {ticket.status!.name}</span>
                  </div>

                  <Scrollbar>
                    <div>
                      <h3>Descripción</h3>
                      <p>{ticket.description}</p>
                      <h3>Creado por</h3>
                      <p>
                        {ticket.userCreatedBy!.name}{" "}
                        {ticket.userCreatedBy!.lastName}
                      </p>

                      {ticket.apartmentId && (
                        <>
                          <h3>Apartamento</h3>
                          <p>{ticket.apartment!.name}</p>
                        </>
                      )}

                      {ticket.solution && (
                        <>
                          <h3>Solución</h3>
                          <p>{ticket.solution}</p>
                        </>
                      )}
                      {ticket.comments && Boolean(ticket.comments.length) && (
                        <>
                          <CommentList comments={ticket.comments!} />
                        </>
                      )}
                    </div>
                  </Scrollbar>
                </Content>
                {ticket.statusType !== "CA" && (
                  <Footer>
                    <Comment onSend={handleAddComment} resetId={ticket.id!} />
                  </Footer>
                )}
              </>
            )}
          </Layout>
        </TicketWrapper>
      </WrapperTemplate>
    </>
  );
}
