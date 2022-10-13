import { React, useState, useContext } from "react";
import {
  collection,
  query,
  where,
  getDoc,
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

  const handleSelect = async (e) => {
    // Check whether the group (chats in firestore) already exists, if not create it
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    console.log(combinedId);
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // Create UserChat
        await updateDoc(doc(db, "user_chats", currentUser.uid), {
          [combinedId + ".user_info"]: {
            uid: user.uid,
            name: user.name,
            avatar: user.avatar,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // Create UserChat to the other user
        await updateDoc(doc(db, "user_chats", user.uid), {
          [combinedId + ".user_info"]: {
            uid: currentUser.uid,
            name: currentUser.displayName,
            avatar: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }
    setUser(null);
    setSearch("");
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
    setErr("");
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
          value={search}
          onChange={(e) => handleChange(e)}
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
