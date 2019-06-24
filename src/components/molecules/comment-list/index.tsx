import React from "react";
import moment from "moment";
import { List, Skeleton, Avatar } from "antd";
import { TicketComment } from "../../../shared-ui/models/ticket.model";

export interface ICommentList {
  comments: TicketComment[];
}

export default function CommentList({ comments = [] }: ICommentList) {
  return (
    <>
      <List
        header={<h4>Comentarios</h4>}
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={Item}
      />
    </>
  );
}

function Item(comment: TicketComment) {
  return (
    <List.Item key={comment.id} style={{ minHeight: "5rem" }}>
      <Skeleton avatar title={false} loading={false} active>
        <List.Item.Meta
          avatar={<Avatar icon="user" size={48} />}
          title={
            <a>
              {comment.userCreatedBy!.name +
                " " +
                comment.userCreatedBy!.lastName}{" "}
              - {moment(comment.createdAt!).format("DD/MMM/YYYY hh:mm:ss a")}
            </a>
          }
          description={comment.comment}
        />
      </Skeleton>
    </List.Item>
  );
}
