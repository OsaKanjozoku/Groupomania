import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import "./Style/index.css";

function Home() {
  const [isInscriptionOpen, setInscriptionIsOpen] = useState(false);
  const [isConnexionOpen, setConnexionIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  // eslint-disable-next-line
  const [loggedUser, setLoggedUser] = useState(false);
  const navigate = useNavigate();
  let item = { email, password };

  useEffect(() => {
    document.title = "Bienvenue sur Groupomania!";
  });

  async function signUp(e) {
    e.preventDefault();
    let result = await fetch("http://localhost:3001/groupomania/auth/signup", {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    // eslint-disable-next-line
    let results = await result.json();
    if (result.status === 201) {
      setMessage("Inscription réussie !");
      login(e);
    } else {
      setEmail("");
      setPassword("");
      setMessage("Une erreur est survenue");
    }
  }
  async function login(e) {
    e.preventDefault();
    let result = await fetch("http://localhost:3001/groupomania/auth/login", {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    // eslint-disable-next-line
    let results = await result.json();

    if (result.status === 200) {
      setLoggedUser(true);
      localStorage.setItem("token", "Bearer " + results.token);
      localStorage.setItem("userId", results.userId);
      localStorage.setItem("role", results.role);
      navigate("/posts");
    } else if (result.status === 401) {
      setMessage("* Paire identifiant/mot de passe incorrecte *");
    }
  }

  return isInscriptionOpen ? (
    <div>
      <Header />
      <div className="article">
        <h1>Inscription</h1>
        <p>Veuillez renseigner les champs ci-dessous</p>
        <form className="form">
          <label>Email : </label>
          <input
            type="email"
            name="email"
            required="true"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br></br>
          <label>Mot de passe : </label>
          <input
            type="password"
            name="password"
            required="true"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="message">{message ? <p>{message}</p> : null}</div>
          <br></br>
          <button type="submit" className="Submit" onClick={signUp}>
            M'inscrire <i class="fa-solid fa-user-plus"></i>
          </button>
        </form>
        <br></br>
        <button
          onClick={() => setInscriptionIsOpen(false)}
          className="cancel-button"
        >
          <i class="fa-solid fa-rotate-left"></i>
        </button>
      </div>
    </div>
  ) : isConnexionOpen ? (
    <div>
      <Header />
      <div className="article">
        <h1>Connexion</h1>
        <p>Renseignez votre mail et mot de passe</p>
        <form className="form">
          <label>Email : </label>
          <input
            type="email"
            name="email"
            required="true"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br></br>
          <label>Mot de passe : </label>
          <input
            type="password"
            name="password"
            required="true"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br></br>
          <div className="message">{message ? <p>{message}</p> : null}</div>
          <br></br>
          <button type="submit" className="Submit" onClick={login}>
            Me connecter
          </button>
        </form>
        <br></br>
        <button
          onClick={() => setConnexionIsOpen(false)}
          className="cancel-button"
        >
          <i class="fa-solid fa-rotate-left"></i>
        </button>
      </div>
    </div>
  ) : (
    <div>
      <Header />
      <div id="Buttons">
        <button
          onClick={() => setInscriptionIsOpen(true)}
          className="affichageForm"
        >
          S'inscrire
        </button>
        <button
          onClick={() => setConnexionIsOpen(true)}
          className="affichageForm"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}

export default Home;
