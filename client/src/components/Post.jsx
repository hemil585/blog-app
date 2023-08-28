import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Post = ({ _id, title, summary, cover, content, createdAt, author }) => {
  return (
    <div className="post">
      <Link to={`/post/${_id}`}>
        <div className="postt-image">
          <img
            src={"http://localhost:8080/" + cover}
            alt="image"
            width={500}
            height={250}
            style={{
              margin: "0 auto",
            }}
          />
        </div>
      </Link>
      <div className="post-texts">
        <Link to={`/post/${_id}`}>
          <h2>{title} </h2>
        </Link>
        <p className="post-info">
          <a className="post-author" href="/">
            {author.username}
          </a>
          <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
        </p>
        <p className="post-summary">{summary}</p>
      </div>
    </div>
  );
};

export default Post;
