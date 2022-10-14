import { React, useState, useEffect, useContext } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function Chats() {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = async () => {
      const unsub = onSnapshot(
        doc(db, "user_chats", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);
  // convertir el objeto chats en un array
  const chatsArray = Object.entries(chats);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="chats">
      {chatsArray
        ?.sort((a, b) => a[1].date - b[1].date)
        .map((chat) => (
          <div
            className="search__user-chat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].user_info)}
          >
            <img src={chat[1].user_info.avatar} alt={chat[1].user_info.name} />
            <div className="search__user-chat__info">
              <span>{chat[1].user_info.name}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Chats;
