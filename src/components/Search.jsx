import { React, useState, useContext } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

function Search() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");
  const { currentUser } = useContext(AuthContext);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleSearch = async (e) => {
    const q = query(collection(db, "users"), where("name", "==", search));
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErr("No se encontró ningún usuario con ese nombre");
        return;
      }
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
        console.log(doc.id, " => ", doc.data());
      });
    } catch (error) {
      setErr(error);
    }
  };
  console.log(user);
  const handleSelect = async (e) => {
    // Check whether the group (chats in firestore) already exists, if not create it
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    console.log(combinedId);
    try {
      const res = await getDocs(collection(db, "chats", combinedId));
      if (res.empty) {
        // Create chat in chats collection
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });
      }
      // Create UserChat
      await updateDoc(doc(db, "user_chats", currentUser.uid), {
        [combinedId + ".user_info"]: {
          uid: user.uid,
          displayName: user.name,
          photoURL: user.avatar,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="search">
      <div className="search__form">
        <input
          type="text"
          placeholder="Buscar usuario..."
          id="search"
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {err && <span className="search__error">{err}</span>}
      {user && (
        <div className="search__user-chat" onClick={(e) => handleSelect(e)}>
          <img src={user.avatar} alt="" />
          <div className="search__user-chat__info">
            <span>{user.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
