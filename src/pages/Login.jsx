import React from "react";
import Add from "../img/addAvatar.png";

function Login() {
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="formLogo">CHATSAKILA</span>
        <span className="formTitle">Iniciar sesión</span>
        <form>
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
          <button type="submit">Iniciar sesión</button>
        </form>
        <p className="formText">
          ¿No tienes una cuenta? <a href="/register">Regístrate</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
