import React from "react";
import { createRoot } from "react-dom/client";
import Home from "./Pages/Accueil";
import Posts from "./Pages/Posts";
import CreatePost from "./Pages/CreatePost";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ModifyPost from "./Pages/ModifyPost";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/posts" element={<Posts />}></Route>
      <Route path="/posts/create" element={<CreatePost />}></Route>
      <Route path="/posts/modify/:id" element={<ModifyPost />}></Route>
    </Routes>
  </BrowserRouter>
);
