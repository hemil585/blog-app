import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import {PacmanLoader} from "react-spinners";

const Homepage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/post").then((res) => {
      res.json().then((posts) => {
        setPosts(posts);
        setLoading(false);
      });
    });
  }, []);
  const override = {
    display: "block",
    margin:'10rem auto'
  };
  return (
      <div>
      {loading && (
        <PacmanLoader
          color={'black'}
          size={15}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
      {posts.length > 0 && posts.map((post) => <Post {...post} />)}
    </div>
  );
};

export default Homepage;
