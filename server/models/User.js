const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [2, "username must be 2 characters long"],
  },
  password: {
    type: String,
    required: true,
    minlength: [4, "password must be 4 characters long"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect username");
};

const UserModel = model("User", userSchema);

module.exports = UserModel;
