import { React, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function Message({ message }) {
  console.log("message debbug", message);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  return (
    <div
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="message__info">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.avatar
          }
          alt=""
        />
      </div>
      <div className="message__content">
        <p>{message.text}</p>
        {message.image && (
          <img src={message.image} alt="message" className="message__image" />
        )}
      </div>
    </div>
  );
}

export default Message;
