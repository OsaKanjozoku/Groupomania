import "./Style/index.css";
import HeaderPosts from "../../components/HeaderPosts";
import { useEffect, useRef, useState } from "react";

function CreatePost() {
  useEffect(() => {
    document.title = "Groupomania créez votre publication 🖱";
  });

  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  async function Post(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("image", image);
    const response = await fetch("http://localhost:3001/image", {
      method: "POST",
      body: formData,
    });
    if (response.status === 200) {
      let responseJson = await response.json();
      let result = await fetch("http://localhost:3001/groupomania/posts", {
        method: "POST",
        body: JSON.stringify({
          text: text,
          imageUrl: responseJson.imageUrl,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `${token}`,
        },
      });
      // eslint-disable-next-line
      let results = await result.json();
      if (result.status === 201) {
        setMessage("Partage réussi !");
        setText("");
        setImage(null);
      } else {
        setMessage("Une erreur est survenue");
      }
    } else {
      setMessage("Une erreur est survenue");
    }
  }

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  return (
    <div>
      <HeaderPosts />
      <div>
        <form className="uploadPost">
          <h1>Partagez ce que vous voulez 😃</h1>
          <textarea
            type="text"
            className="uploadInput"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required="true"
          ></textarea>
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
              </div>
            </div>
          ) : (
            <div className="inputFile">
              <input
                type="file"
                accept="image/*"
                id="submitPost__input"
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
            </div>
          )}

          <button type="submit" className="submitPost" onClick={Post}>
            Publier <i class="fa-solid fa-upload"></i>
          </button>
          <div className="message">{message ? <p>{message}</p> : null}</div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
