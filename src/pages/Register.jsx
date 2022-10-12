import { React, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { useNavigate, Link } from "react-router-dom";
import Add from "../img/addAvatar.png";

function Register() {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarUser, setAvatarUser] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const password2 = e.target.password2.value;
    const avatar = e.target.avatar.files[0];
    if (avatar.name !== "") {
      setAvatarUser(avatar.name);
    } else {
      setAvatarUser("No se ha seleccionado ninguna imagen");
    }
    console.log(name, email, password, password2, avatar);
    if (password !== password2) {
      setErr(
        "Las contraseñas no coinciden, por favor verifique que sean iguales"
      );
      return;
    } else if (name.length > 10) {
      setErr("El nombre es muy largo, por favor ingrese un nombre más corto");
      return;
    } else {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        console.log(res.user);

        const storageRef = ref(storage, `avatars/${res.user.uid}`);

        const uploadTask = uploadBytesResumable(storageRef, avatar);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`${progress}% completado de  ${snapshot.totalBytes}%`);
            setErr(`${progress}% completado de  ${snapshot.totalBytes}%`);
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
                try {
                  // Actualizar el perfil del usuario con la imagen de perfil
                  await updateProfile(res.user, {
                    displayName: name,
                    photoURL: downloadURL,
                  })
                    .then(() => {
                      console.log("Usuario actualizado");
                    })
                    .catch((error) => {
                      console.log(error);
                    });

                  // Encriptar la contraseña del usuario
                  const hash = await bcrypt.hash(password, 10);
                  console.log(hash);
                  // añadir el usuario a la base de datos llamada users
                  if (hash !== null) {
                    await setDoc(doc(db, "users", res.user.uid), {
                      uid: res.user.uid,
                      name,
                      email,
                      password: hash,
                      avatar: downloadURL,
                    });
                  } else {
                    console.log("Error al encriptar la contraseña");
                  }
                  // Crear un documento en la colección llamada chats
                  await setDoc(doc(db, "user_chats", res.user.uid), {})
                    .then(() => {
                      console.log("Documento creado");
                      navigate("/");
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } catch (error) {
                  console.log(error);
                }
              }
            );
          }
        );
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          setErr("El correo ya está en uso");
        } else if (err.code === "auth/invalid-email") {
          setErr("El correo no es válido");
        } else if (err.code === "auth/weak-password") {
          setErr("La contraseña debe tener al menos 6 caracteres");
        } else {
          setErr("Error al crear el usuario");
        }
      }
    }
  };

  const handleFile = () => {
    document.getElementById("avatar").onchange = (e) => {
      const file = e.target.files[0];
      setAvatarUser(file.name);
    };
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
          <label
            htmlFor="avatar"
            className="fileLabel"
            onClick={() => handleFile()}
          >
            <img src={Add} alt="add" />
            {avatarUser ? avatarUser : "Selecciona tu avatar"}
          </label>
          <button type="submit">Registrarse</button>
        </form>
        {loading && (
          <span className="form__alert">
            Subiendo y comprimiendo la imagen por favor espere...
          </span>
        )}
        {err && <span className="form__error">{err}</span>}
        <p className="formText">
          ¿Ya tienes una cuenta? <Link to="/login"> Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
