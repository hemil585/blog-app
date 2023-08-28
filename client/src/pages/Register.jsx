import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      setError(errorData.errors);
    } else {
      alert("registration successful");
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <form className="register" onSubmit={onSubmit}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {error.length !== 0 && <div className="auth-error">{error.username}</div>}
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error.length !== 0 && <div className="auth-error">{error.password}</div>}
      <button>Register</button>
    </form>
  );
};

export default Register;
