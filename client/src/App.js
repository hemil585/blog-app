import React from "react";
import "./App.css";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserContextProvider } from "./context/User";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import EditPost from "./pages/EditPost";

const App = () => {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
};

export default App;
