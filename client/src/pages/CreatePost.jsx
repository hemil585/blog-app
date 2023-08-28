import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";


const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [files, setFiles] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const createNewPost = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);

    const response = await fetch("http://localhost:8080/post", {
      method: "POST",
      body: data,
      credentials: 'include'
    });
    
     if (response.ok) {
      setRedirect(true);
    } 
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        required
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} required />
      <ReactQuill
        value={content}
        onChange={(value) => setContent(value)} // The value here is the HTML-formatted content
        modules={modules}
        formats={formats}
        required
      />
      <button
        style={{
          marginTop: "2rem",
          fontFamily: "Montserrat",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        Post
      </button>
    </form>
  );
};

export default CreatePost;
