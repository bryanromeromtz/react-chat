import { React, useContext } from "react";

import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

function Chat() {
  const { data } = useContext(ChatContext);
  const { name, avatar, lastMessage } = data.user;
  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__header__info">
          {/* mostrar si hay imagen y nombre */}
          {avatar && <img src={avatar} alt={name} />}
          {name && <span>{name}</span>}
        </div>
        <div className="chat__header__icons">
          <img src={Cam} alt="cam" />
          <img src={Add} alt="add" />
          <img src={More} alt="more" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
}

export default Chat;
