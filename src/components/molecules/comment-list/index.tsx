import React from "react";
import moment from "moment";
import { TicketComment } from "../../../shared-ui/models/ticket.model";

export interface ICommentList {
  comments: TicketComment[];
}

export default function CommentList({ comments = [] }: ICommentList) {
  return (
    <>
      {comments.map(comment => {
        return (
          <div
            key={comment.id}
            style={{
              background: "#fafafa",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              marginBottom: "0.5rem"
            }}
          >
            <span>
              <strong>
                {comment.userCreatedBy!.name} {comment.userCreatedBy!.lastName}{" "}
                ({comment.userCreatedBy!.username})
              </strong>{" "}
              - {moment(comment.createdAt).format("DD/MMM/YYYY hh:mm:ss a")}
            </span>
            <p style={{ marginLeft: "1rem" }}>{comment.comment}</p>
          </div>
        );
      })}
    </>
  );
}
