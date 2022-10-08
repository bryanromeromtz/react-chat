import React from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import Add from "../img/addAvatar.png";

function Register() {
  const [err, setErr] = React.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const password2 = e.target.password2.value;
    const avatar = e.target.avatar.files[0];
    console.log(name, email, password, password2, avatar);
    if (password !== password2) {
      setErr(
        "Las contraseñas no coinciden, era una vez un gato que se llamaba  gatito y era muy bonito"
      );
      return;
    } else {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        const storageRef = ref(storage, `avatars/${res.user.uid}`);

        const uploadTask = uploadBytesResumable(storageRef, avatar);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`${progress}% completado de  ${snapshot.totalBytes}`);
            setErr(`${progress}% completado de  ${snapshot.totalBytes}`);
            switch (snapshot.state) {
              case "paused":
                console.log("La subida está pausada");
                break;
              case "running":
                console.log("La subida está en curso");
                break;
              default:
                console.log("No se ha podido subir el archivo");
                break;
            }
          },
          (error) => {
            setErr("Error al subir la imagen");
          },
          () => {
            // Manejar cargas exitosas al completar
            // Por ejemplo, obtener la URL de descarga de la imagen
            // https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("Archivo disponible en", downloadURL);
                const userUpdate = await updateProfile(res.user, {
                  displayName: name,
                  photoURL: downloadURL,
                });
                console.log(userUpdate);

                const hash = await bcrypt.hash(password, 10);
                console.log(hash);
                // añadir el usuario a la base de datos llamada users
                await setDoc(doc(db, "users", res.user.uid), {
                  uid: res.user.uid,
                  name,
                  email,
                  password,
                  avatar: downloadURL,
                });
              }
            );
          }
        );
      } catch (err) {
        setErr("Algo salió mal, intente de nuevo");
        console.log(err);
      }
    }
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
        {err && <span className="form__error">{err}</span>}
        <p className="formText">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
