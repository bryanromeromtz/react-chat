import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth } from "../firebase";
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
      alert("Las contraseñas no coinciden");
    } else {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        // .then((userCredential) => {
        //   // Signed in
        //   const user = userCredential.user;
        //   console.log(user);
        // })
        // .catch((error) => {
        //   const errorCode = error.code;
        //   const errorMessage = error.message;
        //   setErr("Algo salió mal, intente de nuevo");
        //   // ..
        // });

        const storage = getStorage();
        const storageRef = ref(storage, "images/rivers.jpg");

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
            });
          }
        );
      } catch (err) {
        setErr("Algo salió mal, intente de nuevo");
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
          {err && <span className="formError">{err}</span>}
        </form>
        <p className="formText">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
