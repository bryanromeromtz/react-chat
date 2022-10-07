import React from "react";

function Message() {
  return (
    <div className="message owner">
      <div className="message__info">
        <img src="https://robohash.org/user69" alt="user" />
        <p>
          justo <span>hace 1 minuto</span>
        </p>
      </div>
      <div className="message__content">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam</p>
        <img src="https://robohash.org/user46" alt="user" />
      </div>
    </div>
  );
}

export default Message;
