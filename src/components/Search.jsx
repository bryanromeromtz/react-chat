import React from "react";

function Search() {
  return (
    <div className="search">
      <div className="search__form">
        <input type="text" placeholder="Contactos" />
      </div>
      <div className="search__user-chat">
        <img src="https://robohash.org/user99" alt="user" />
        <div className="search__user-chat__info">
          <span>usuario</span>
        </div>
      </div>
    </div>
  );
}

export default Search;
