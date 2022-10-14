import { React, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";

import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { db, storage } from "../firebase";

function Input() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [err, setErr] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async (e) => {
    if (text.trim() === "") {
      return;
    }
    if (file) {
      const storageRef = ref(storage, `imagesChat/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`${progress}% completado de  ${snapshot.totalBytes}%`);
        },
        (error) => {
          setErr("Error al subir la imagen");
          console.log(error);
        },
        () => {
          // Manejar cargas exitosas al completar
          // Por ejemplo, obtener la URL de descarga de la imagen
          // https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("Archivo disponible en", downloadURL);
            try {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  image: downloadURL,
                }),
              });
            } catch (error) {
              console.log(error);
            }
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "user_chats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".lastMessageDate"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "user_chats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".lastMessageDate"]: serverTimestamp(),
    });

    setText("");
    setFile(null);
  };
  return (
    <div className="input">
      <input
        placeholder="Escribe un mensaje..."
        type="text"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="input__send">
        <img src={Attach} alt="attach" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="img" />
        </label>
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}

export default Input;
