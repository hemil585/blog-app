require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");

const Post = require("./models/Post");

const server = express();

server.use(express.json());
server.use(morgan("dev"));
server.use(cors({ credentials: true, origin: "http://localhost:3000" }));
server.use(cookieParser());

server.use("/uploads", express.static(__dirname + "/uploads")); // static file server

const connectionToDB = (async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB!");
  } catch (err) {
    console.error(err);
  }
})();

const handleError = (err) => {
  let errors = { username: "", password: "" };

  if (err.message === "incorrect username") {
    errors.username = "that username is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "wrong password";
  }

  if (err.code === 11000) {
    errors.username = "username is already taken";
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (username, id) => {
  return jwt.sign({ username, id }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

server.get('/',(req,res)=>{
  res.send('Blog App')
})

server.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });
    const token = await createToken(username, user._id);
    await res.cookie("jwtToken", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.json(user);
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
});

server.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = await createToken(username, user._id);
    await res.cookie("jwtToken", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ id: user._id, username });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
});

server.get("/profile", (req, res) => {
  const { jwtToken } = req.cookies;

  jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, {}, (err, decodedToken) => {
    if (err) throw err;
    res.json(decodedToken);
  });
});

server.post("/logout", (req, res) => {
  res.cookie("jwtToken", "");
  res.status(200).send("Logged out successfully");
});

// uploadMiddleware.single("file") middleware is used to handle a single uploaded file with the field name "file" in the form.
server.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const extension = parts[parts.length - 1];
  const newPath = path + "." + extension;
  // console.log(path,newPath);
  fs.renameSync(path, newPath);

  const { jwtToken } = req.cookies;
  jwt.verify(
    jwtToken,
    process.env.JWT_SECRET_KEY,
    {},
    async (err, decodedToken) => {
      if (err) throw err;
      // console.log('decodedToken: ',decodedToken);
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: decodedToken.id,
      });

      res.json(postDoc);
    }
  );
});

server.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

server.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]); // wants only username
  res.json(postDoc);
});

server.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { jwtToken } = req.cookies;
  jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = newPath ? newPath : postDoc.cover;
    await postDoc.save();

    res.json(postDoc);
  });
});

server.delete("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findByIdAndDelete(id);
  res.status(200).json(postDoc);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is alive at http://localhost:${PORT}`);
});
