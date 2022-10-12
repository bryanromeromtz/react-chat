import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const [err, setErr] = useState("");
  // const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          if (user) {
            navigate("/");
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/wrong-password") {
            setErr("Contraseña incorrecta");
          } else if (errorCode === "auth/user-not-found") {
            setErr("Usuario no encontrado");
          } else if (errorCode === "auth/internal-error") {
            setErr("Error de servidor");
          } else if (errorCode === "auth/invalid-email") {
            setErr("Email inválido");
          } else {
            setErr(errorMessage);
          }
        });
    } catch (error) {
      console.log(error);
      setErr(error.message);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="formLogo">PIGEONE</span>
        <span className="formTitle">Iniciar sesión</span>
        <form onSubmit={handleSubmit}>
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
        {err && <span className="form__error">{err}</span>}
        <p className="formText">
          ¿No tienes una cuenta? <Link to="/register"> Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
