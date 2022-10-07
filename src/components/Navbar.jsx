import React from "react";

function Navbar() {
  return (
    <div className="navbar">
      <span className="navbar__logo">PIGEONE</span>
      <div className="navbar__user">
        <img src="https://robohash.org/user99" alt="user" />
        <span>usuario</span>
        <button>Salir</button>
      </div>
    </div>
  );
}

export default Navbar;
