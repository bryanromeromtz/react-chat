import React from "react";
import Add from "../img/addAvatar.png";

function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const password2 = e.target.password2.value;
    const avatar = e.target.avatar.files[0];
    console.log(name, email, password, password2, avatar);
    // if (password !== password2) {
    //   alert("Las contraseñas no coinciden");
    // } else {
    //   console.log("Todo bien");
    //   fetch("http://localhost:4000/api/users/register", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       name,
    //       email,
    //       password,
    //     }),
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       if (data.error) {
    //         alert(data.error);
    //       } else {
    //         alert("Usuario registrado con éxito");
    //       }
    //     })
    //     .catch((err) => console.log(err));
    // }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="formLogo">PIGEONE</span>
        <span className="formTitle">Registrarse</span>
        <form onSubmit={handleSubmit}>
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
            autoComplete="on"
            id="password"
            placeholder="Contraseña"
          />
          <input
            type={"password"}
            name="password2"
            autoComplete="on"
            id="password2"
            placeholder="Confirmar contraseña"
          />
          <input
            style={{ display: "none" }}
            type="file"
            name="avatar"
            id="avatar"
          />
          <label htmlFor="avatar" className="fileLabel">
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
