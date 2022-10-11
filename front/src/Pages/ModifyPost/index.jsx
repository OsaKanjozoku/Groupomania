import "../CreatePost/Style/index.css";
import HeaderPosts from "../../components/HeaderPosts";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function ModifyPost() {
  useEffect(() => {
    document.title = "Groupomania modifiez votre publication 🖱";
  });

  // eslint-disable-next-line
  const [error, setError] = useState(false);
  const [post, setPost] = useState([]);
  const { id } = useParams();
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const [image, setImage] = useState("");
  // eslint-disable-next-line
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  let navigate = useNavigate();
  // eslint-disable-next-line
  const posts = () => {
    let path = `posts`;
    navigate(path);
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(
          "http://localhost:3001/groupomania/posts/" + id,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `${token}`,
            },
          }
        );
        setPost(await response.json());
        if (post.imageUrl === null || post.imageUrl === undefined) {
          setImage(null);
        } else {
          setImage(post.imageUrl);
        }
      } catch (err) {
        console.log("===== error =====", err);
        console.log(err);
        setError(true);
      }
    }
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  async function Post(e) {
    e.preventDefault();

    if (text === "" || text === undefined) {
      setText(post.text);
    } else if (image === null) {
      let result = await fetch(
        "http://localhost:3001/groupomania/posts/" + id,
        {
          method: "PUT",
          body: JSON.stringify({
            text: text,
            imageUrl: null,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (result.status === 200) {
        setMessage("Modification effectuée !");
        setImage(null);
      } else {
        setMessage("Une erreur est survenue");
        setImage(null);
      }
    } else {
      let formData = new FormData();
      formData.append("image", image);
      const response = await fetch("http://localhost:3001/image", {
        method: "POST",
        body: formData,
      });
      if (response.status === 200) {
        let responseJson = await response.json();
        let result = await fetch(
          "http://localhost:3001/groupomania/posts/" + id,
          {
            method: "PUT",
            body: JSON.stringify({
              text: text,
              imageUrl: responseJson.imageUrl,
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `${token}`,
            },
          }
        );
        // eslint-disable-next-line
        let results = await result.json();
        if (result.status === 200) {
          setMessage("Modification effectuée !");
          setImage(null);
        } else {
          setMessage("Une erreur est survenue");
        }
      } else {
        setMessage("Une erreur est survenue");
      }
      navigate("/posts");
    }
  }

  function deleteImage(e) {
    e.preventDefault();
    setImage(null);
    post.imageUrl = null;
    let element = document.getElementById("imageUrl");
    element.remove();
    // eslint-disable-next-line
    let result = fetch("http://localhost:3001/groupomania/posts/image/" + id, {
      method: "PUT",
      body: JSON.stringify({
        imageUrl: null,
      }),
      Authorization: `${token}`,
    });
  }

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        post.imageUrl = null;
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
    // eslint-disable-next-line
  }, [image]);

  return (
    <div>
      <HeaderPosts />
      <div>
        <form className="uploadPost">
          <h1>Modifiez votre publication 😎</h1>
          <textarea
            type="text"
            className="uploadInput"
            defaultValue={post.text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          {post.imageUrl ? (
            <div id="imageUrl">
              <img
                className="preview"
                src={post.imageUrl}
                alt="Ficher téléchargé par l'utilisateur"
              />
            </div>
          ) : null}
          {preview ? (
            <div>
              <img
                className="preview"
                src={preview}
                alt="Ficher téléchargé par l'utilisateur"
              />
              <div className="inputFile">
                <input
                  type="file"
                  accept="image/*"
                  id="submitPost__input"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImage(file);
                    } else {
                      setImage(null);
                    }
                  }}
                ></input>
                <label for="submitPost__input" id="submitPost__label">
                  Changer d'image <i class="fa-regular fa-image"></i>
                </label>
                <label for="submitPost__delete" id="submitPost__label">
                  Supprimer l'image <i class="fa-solid fa-eraser"></i>
                </label>
                <button
                  id="submitPost__delete"
                  onClick={(e) => {
                    deleteImage(e);
                  }}
                ></button>
              </div>
            </div>
          ) : (
            <div className="inputFile">
              <input
                type="file"
                accept="image/*"
                id="submitPost__input"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                  } else {
                    setImage(null);
                  }
                }}
              ></input>
              <label for="submitPost__input" id="submitPost__label">
                Ajouter une image <i class="fa-regular fa-image"></i>
              </label>
              <label for="submitPost__delete" id="submitPost__label">
                Supprimer l'image <i class="fa-solid fa-eraser"></i>
              </label>
              <button
                id="submitPost__delete"
                onClick={(e) => {
                  deleteImage(e);
                }}
              ></button>
            </div>
          )}

          <button type="submit" className="submitPost" onClick={Post}>
            Modifier ma publication <i class="fa-solid fa-upload"></i>
          </button>
          <div className="message">{message ? <p>{message}</p> : null}</div>
        </form>
      </div>
    </div>
  );
}

export default ModifyPost;
