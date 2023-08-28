import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/User";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState({});
  const { setUserInfo } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.errors);
    } else {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form className="login" onSubmit={onSubmit}>
      <h1>Login</h1>
      <h3>Welcome Back!</h3>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {error.length !== 0 && <div className="auth-error">{error.username}</div>}
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error.length !== 0 && <div className="auth-error">{error.password}</div>}
      <button>Login</button>
    </form>
  );
};

export default Login;
