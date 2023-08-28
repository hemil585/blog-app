import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/User";
import { TfiWrite } from "react-icons/tfi";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:8080/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((json) => {
        console.log("user header info: ", json);
        setUserInfo(json);
      });
    });
  }, []);

  const logout = () => {
    fetch("http://localhost:8080/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  };

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="blog-logo">
        Blogs
      </Link>
      <div className="login-logout">
        {username && (
          <>
            <Link to="/create" className="write-blog-a">
              <span>
                <TfiWrite className="write-blog-icon" /> Write Blog
              </span>
            </Link>
            <a href="/" className="logout-a" onClick={logout}>
              Logout (<p>{username}</p>) 
            </a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
