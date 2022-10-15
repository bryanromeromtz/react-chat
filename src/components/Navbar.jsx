import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Logout from "../img/logout.png";
import { AuthContext } from "../context/AuthContext";
import Logo from "../img/logo1.png";

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth);
    navigate("/login");
  };
  return (
    <div className="navbar">
      <span className="navbar__logo">
        <img src={Logo} alt="logo" />
      </span>
      <div className="navbar__user">
        <img src={currentUser.photoURL} alt="user" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => handleSignOut()}>
          <img src={Logout} alt="logout" />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
