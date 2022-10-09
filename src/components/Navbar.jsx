import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Logout from "../img/logout.png";

function Navbar() {
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth);
    navigate("/login");
  };
  return (
    <div className="navbar">
      <span className="navbar__logo">PIGEONE</span>
      <div className="navbar__user">
        <img src="https://robohash.org/user99" alt="user" />
        <span>usuario</span>
        <button onClick={() => handleSignOut()}>
          <img src={Logout} alt="logout" />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
