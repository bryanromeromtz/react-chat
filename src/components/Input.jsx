import React from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";

function Input() {
  return (
    <div className="input">
      <input placeholder="Escribe un mensaje..." type="text" />
      <div className="input__send">
        <img src={Attach} alt="attach" />
        <input type="file" style={{ display: "none" }} id="file" />
        <label htmlFor="file">
          <img src={Img} alt="img" />
        </label>
        <button>Enviar</button>
      </div>
    </div>
  );
}

export default Input;
