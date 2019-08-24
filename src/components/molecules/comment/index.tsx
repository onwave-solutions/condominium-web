import React, { useState, useEffect } from "react";
import { InputArea } from "../../atoms/input";
import Button from "../../atoms/button";

export interface IComment {
  resetId?: string | number;
  onSend(comment: string): void;
}

export default function Comment({ resetId, onSend }: IComment) {
  const [comment, setComment] = useState<string>("");
  useEffect(() => {
    setComment("");
  }, [resetId]);
  const handleSend = () => {
    if (!comment) return;
    onSend(comment);
    setComment("");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <InputArea
        placeholder="Comentario"
        className="isoNoteTextbox"
        value={comment}
        onPressEnter={handleSend}
        onChange={event => setComment(event.target.value)}
        autoFocus
      />
      <Button
        type="primary"
        disabled={!comment}
        className="isoAddNoteBtn"
        onClick={handleSend}
        style={{ marginLeft: 5 }}
      >
        Enviar
      </Button>
    </div>
  );
}
