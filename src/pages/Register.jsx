import React from "react";
import Add from "../img/addAvatar.png";

function Register() {
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="formLogo">CHATSAKILA</span>
        <span className="formTitle">Registrarse</span>
        <form>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Nombre de usuario"
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Correo electrónico"
          />
          <input
            type={"password"}
            name="password"
            id="password"
            placeholder="Contraseña"
          />
          <input
            style={{ display: "none" }}
            type="file"
            name="file"
            id="file"
          />
          <label htmlFor="file" className="fileLabel">
            <img src={Add} alt="add" /> Agrega un avatar
          </label>
          <button type="submit">Registrarse</button>
        </form>
        <p className="formText">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
