import logo from "../../images/icon-left-font-colors.png";
import "./Style/index.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HeaderPosts() {
  // eslint-disable-next-line
  const [loggedUser, setLoggedUser] = useState(false);

  let navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedUser(false);
    navigate("/");
  };

  return (
    <div className="HeaderPosts">
      <Link to="/posts" className="HeaderPosts__Link">
        <img
          alt="Logo Groupomania black"
          src={logo}
          className="HeaderPosts__img"
        />
      </Link>

      <nav>
        <button onClick={logout} className="HeaderPosts__button">
          Déconnexion
        </button>
      </nav>
    </div>
  );
}

export default HeaderPosts;
