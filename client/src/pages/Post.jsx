import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../context/User";
import { PacmanLoader } from "react-spinners";

const Post = () => {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/post/${id}`).then((res) => {
      res.json().then((postInfo) => {
        setPostInfo(postInfo);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
    });
  }, []);

  const override = {
    display: "block",
    margin: "10rem auto",
  };

  const deletePost = async () => {
    const response = await fetch(`http://localhost:8080/post/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await response.json();
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  if (!postInfo) return "";

  return (
    <>
      <div className="post-page">
        {loading && (
          <PacmanLoader
            color={"black"}
            size={15}
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
        {!loading && postInfo && (
          <>
            <h1>{postInfo.title}</h1>
            <time>
              {format(new Date(postInfo.createdAt), "MMM d, yyyy HH:mm")}
            </time>
            <div className="post-author">
              by <span>@{postInfo.author.username}</span>
            </div>
            {userInfo.id === postInfo.author._id && (
              <>
                <Link to={`/edit/${postInfo._id}`} className="edit-row">
                  <a className="edit-btn" href="/">
                    Edit this post
                  </a>
                </Link>
                <a className="delete-btn" onClick={deletePost}>
                  Delete this post
                </a>
              </>
            )}
            <div className="image">
              <img
                src={`http://localhost:8080/${postInfo.cover}`}
                alt="blog-image"
              />
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: postInfo.content }}
              className="post-content"
            />
          </>
        )}
      </div>
    </>
  );
};

export default Post;
