import { React, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
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
    e.preventDefault();
    if (file) {
      const storageRef = ref(storage, `imagesChat/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`${progress}% completado de  ${snapshot.totalBytes}%`);
          setErr(`${progress}% completado de  ${snapshot.totalBytes}%`);
          switch (snapshot.state) {
            case "paused":
              console.log("La subida está pausada");
              break;
            case "running":
              console.log("La subida está en curso");
              break;
            default:
              console.log("No se ha podido subir el archivo");
              break;
          }
        },
        (error) => {
          setErr("Error al subir la imagen");
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
  };
  return (
    <div className="input">
      <input
        placeholder="Escribe un mensaje..."
        type="text"
        onChange={(e) => setText(e.target.value)}
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
        <button onClick={(e) => handleSend(e)}>Enviar</button>
      </div>
    </div>
  );
}

export default Input;
