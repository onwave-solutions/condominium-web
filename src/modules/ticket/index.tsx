import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import TicketWrapper from "../../components/molecules/ticket-wrapper";
import Button from "../../components/atoms/button";
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
import { IQuery } from "../../shared-ui/models/keylist";
import CommentList from "../../components/molecules/comment-list";
import WrapperTemplate from "../../components/templates/wrapper-template";

const { Header, Content, Footer } = Layout;

const managerState = select(managerSelector);
const ticketState = select(ticketSelector);
const appState = select(appSelector);

function buildQuery(condominiumId: number) {
  return ({ state, query }: IQuery): Partial<Ticket>[] => {
    const base: Partial<Ticket> = { condominiumId, statusType: state };
    if (!query) return [base];
    return [
      { ...base, description: query.toUpperCase() },
      { ...base, solution: query.toUpperCase() },
      { ...base, title: query.toUpperCase() }
    ];
  };
}

export default function TicketView(props: IModule) {
  const [query, setQuery] = useState<IQuery>({});
  const condominium = useReduxState(managerState("condominium"));
  const keylist = useReduxState(appState("keylist"));
  const tickets = useReduxState(ticketState("tickets"));
  const [ticket, setTicket] = useState<Ticket>({});
  const [createTicketVisible, setCreateTicketVisible] = useState<boolean>(
    false
  );
  const queryBuilder = buildQuery(condominium.id!);

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
    await onCreateTicket({ ...ticket, condominiumId: condominium.id }, onCb);
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
  }, [parseInt(`${condominium.id}`, 10)]);
  return (
    <>
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
              {!ticket.id && (
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
              )}
              {ticket.id && (
                <>
                  <Button
                    type="primary"
                    className="isoAddNoteBtn"
                    style={{ marginLeft: "0.5rem" }}
                    onClick={() => setTicket({})}
                  >
                    Limpiar
                  </Button>
                  {!["CA", "RE"].includes(ticket.statusType!) && (
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
              {["ES", "PA"].includes(ticket.statusType!) && (
                <Button
                  type="primary"
                  className="isoAddNoteBtn"
                  onClick={handleUpdateTicket({ ...ticket, statusType: "TR" })}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Empezar a Trabajar
                </Button>
              )}
              {ticket.statusType === "TR" && (
                <Button
                  type="ghost"
                  onClick={handleUpdateTicket({ ...ticket, statusType: "RE" })}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Resolver
                </Button>
              )}
              {ticket.statusType === "TR" && (
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

                  <h3>Descripción</h3>
                  <p>{ticket.description}</p>
                  {ticket.solution && (
                    <>
                      <h3>Solución</h3>
                      <p>{ticket.solution}</p>
                    </>
                  )}
                  {ticket.comments && Boolean(ticket.comments.length) && (
                    <>
                      <h4 style={{ marginBottom: "1rem", marginTop: "1rem" }}>
                        Comentarios
                      </h4>
                      <div
                        style={{
                          flex: 1,
                          marginLeft: "2rem",
                          overflowY: "auto"
                        }}
                      >
                        <CommentList comments={ticket.comments!} />
                      </div>{" "}
                    </>
                  )}
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
      <TicketCreateForm
        visible={createTicketVisible}
        onCreate={handleCreateTicket}
        onClose={handleCreateTicketModal(false)}
      />
    </>
  );
}
