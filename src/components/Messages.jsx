import { React, useContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";
import Message from "./Message";

function Messages() {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const getMessages = async () => {
      const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
      return () => {
        unsub();
      };
    };
    data.chatId && getMessages();
  }, [data.chatId]);
  return (
    <div className="messages">
      {messages?.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}

export default Messages;
