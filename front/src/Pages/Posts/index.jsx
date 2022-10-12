import "./Style/index.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "./Utils/loader";
import HeaderPosts from "../../components/HeaderPosts";

function Posts() {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [isDataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(false);
  // eslint-disable-next-line
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.title = "Groupomania 🖥";
  });

  let navigate = useNavigate();
  const create = () => {
    let path = `create`;
    navigate(path);
  };

  useEffect(() => {
    async function fetchPosts() {
      setDataLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3001/groupomania/posts",
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `${token}`,
            },
          }
        );
        setPosts(await response.json());
      } catch (err) {
        console.log("===== error =====", err);
        console.log(err);
        setError(true);
      } finally {
        setDataLoading(false);
      }
    }
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  async function DeleteAdmin(e, post) {
    e.preventDefault();
    let id = post._id;

    // eslint-disable-next-line
    let result = await fetch(
      "http://localhost:3001/groupomania/posts/admin/" + id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `${token}`,
        },
      }
    );
    try {
      const response = await fetch("http://localhost:3001/groupomania/posts", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `${token}`,
        },
      });
      setPosts(await response.json());
    } catch (err) {
      console.log("===== error =====", err);
      console.log(err);
      setError(true);
    } finally {
      setDataLoading(false);
    }
  }

  async function Delete(e, post) {
    e.preventDefault();
    let id = post._id;

    // eslint-disable-next-line
    let result = await fetch("http://localhost:3001/groupomania/posts/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `${token}`,
      },
    });
    try {
      const response = await fetch("http://localhost:3001/groupomania/posts", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `${token}`,
        },
      });
      setPosts(await response.json());
    } catch (err) {
      console.log("===== error =====", err);
      console.log(err);
      setError(true);
    } finally {
      setDataLoading(false);
    }
  }

  async function Like(e, post) {
    e.preventDefault();
    let id = post._id;
    let usersLiked = post.usersLiked;

    if (usersLiked.includes(userId) === false) {
      // eslint-disable-next-line
      let result = await fetch(
        "http://localhost:3001/groupomania/posts/like/" + id,
        {
          method: "POST",
          body: JSON.stringify({
            like: 1,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `${token}`,
          },
        }
      );
      try {
        const response = await fetch(
          "http://localhost:3001/groupomania/posts",
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `${token}`,
            },
          }
        );
        setPosts(await response.json());
      } catch (err) {
        console.log("===== error =====", err);
        console.log(err);
        setError(true);
      } finally {
        setDataLoading(false);
      }
    } else {
      // eslint-disable-next-line
      let result = await fetch(
        "http://localhost:3001/groupomania/posts/like/" + id,
        {
          method: "POST",
          body: JSON.stringify({
            like: 0,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `${token}`,
          },
        }
      );
      try {
        const response = await fetch(
          "http://localhost:3001/groupomania/posts",
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `${token}`,
            },
          }
        );
        setPosts(await response.json());
      } catch (err) {
        console.log("===== error =====", err);
        console.log(err);
        setError(true);
      } finally {
        setDataLoading(false);
      }
    }
  }

  function modify(e, post) {
    let id = post._id;
    navigate("modify/" + id);
  }

  if (error) {
    console.log(error);
  }

  return isDataLoading ? (
    <Loader />
  ) : role === "admin" ? (
    //
    //
    // ADMIN
    //
    //
    //
    <div className="Page">
      <HeaderPosts />

      <div className="createPost">
        <button onClick={create}>
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
      <div className="Card">
        {posts.map((post, index) =>
          post.imageUrl === undefined || post.imageUrl === null ? (
            //
            //
            // ADMIN + IMAGE UNDEFINED
            //
            //
            //
            <div className="Card__unique">
              <p className="Card__unique__text">{post.text}</p>
              <div className="buttons">
                <button
                  className="buttons__button"
                  onClick={(e) => {
                    modify(e, post);
                  }}
                >
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button
                  className="buttons__button"
                  onClick={(e) => {
                    DeleteAdmin(e, post);
                  }}
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
                <button
                  className="buttons__button"
                  onClick={(e) => {
                    Like(e, post);
                  }}
                >
                  <i class="fa-solid fa-heart"></i>
                </button>
                {post.likes}
              </div>
            </div>
          ) : (
            //
            //
            // ADMIN + IMAGE
            //
            //
            //
            <div className="Card__unique" id={post._id}>
              <img
                className="Card__unique__img"
                src={post.imageUrl}
                alt="Fichier téléchargé par l'utilisateur"
              ></img>
              <p className="Card__unique__text">{post.text}</p>
              <div className="buttons">
                <button
                  className="buttons__button"
                  onClick={(e) => {
                    modify(e, post);
                  }}
                >
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button
                  className="buttons__button"
                  onClick={(e) => {
                    Delete(e, post);
                  }}
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
                <button
                  className="buttons__button"
                  onClick={(e) => {
                    Like(e, post);
                  }}
                >
                  <i class="fa-solid fa-heart"></i>
                </button>
                {post.likes}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  ) : (
    //
    //
    // PAS ADMIN
    //
    //
    //
    <div className="Page">
      <HeaderPosts />

      <div className="createPost">
        <button onClick={create}>
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
      <div className="Card">
        {posts.map((post, index) =>
          post.userId === userId ? (
            post.imageUrl === undefined || post.imageUrl === null ? (
              //
              //
              // PAS ADMIN + userId === post.userId + IMAGE UNDEFINED
              //
              //
              //
              <div className="Card__unique">
                <p className="Card__unique__text">{post.text}</p>
                <div className="buttons">
                  <button
                    className="buttons__button"
                    onClick={(e) => {
                      modify(e, post);
                    }}
                  >
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button
                    className="buttons__button"
                    onClick={(e) => {
                      Delete(e, post);
                    }}
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                  <button
                    className="buttons__button"
                    onClick={(e) => {
                      Like(e, post);
                    }}
                  >
                    <i class="fa-solid fa-heart"></i>
                  </button>
                  {post.likes}
                </div>
              </div>
            ) : (
              //
              //
              // PAS ADMIN + userId === post.userId + IMAGE
              //
              //
              //
              <div className="Card__unique" id={post._id}>
                <img
                  className="Card__unique__img"
                  src={post.imageUrl}
                  alt="Fichier téléchargé par l'utilisateur"
                ></img>
                <p className="Card__unique__text">{post.text}</p>
                <div className="buttons">
                  <button
                    className="buttons__button"
                    onClick={(e) => {
                      modify(e, post);
                    }}
                  >
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button
                    className="buttons__button"
                    onClick={(e) => {
                      modify(e, post);
                    }}
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                  <button
                    className="buttons__button"
                    onClick={(e) => {
                      Like(e, post);
                    }}
                  >
                    <i class="fa-solid fa-heart"></i>
                  </button>
                  {post.likes}
                </div>
              </div>
            )
          ) : post.imageUrl === undefined || post.imageUrl === null ? (
            //
            //
            // PAS ADMIN + userId != post.userId + IMAGE UNDEFINED
            //
            //
            //
            <div className="Card__unique">
              <p className="Card__unique__text">{post.text}</p>
              <div className="buttons">
                <button
                  className="buttons__button"
                  onClick={(e) => {
                    Like(e, post);
                  }}
                >
                  <i class="fa-solid fa-heart"></i>
                </button>
                {post.likes}
              </div>
            </div>
          ) : (
            //
            //
            // PAS ADMIN + userId != post.userId + IMAGE
            //
            //
            //
            <div className="Card__unique" id={post._id}>
              <img
                className="Card__unique__img"
                src={post.imageUrl}
                alt="Fichier téléchargé par l'utilisateur"
              ></img>
              <p className="Card__unique__text">{post.text}</p>
              <div className="buttons">
                <button
                  className="buttons__button"
                  onClick={(e) => {
                    Like(e, post);
                  }}
                >
                  <i class="fa-solid fa-heart"></i>
                </button>
                {post.likes}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Posts;
