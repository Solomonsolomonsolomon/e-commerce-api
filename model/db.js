const mongoose = require("mongoose");
const { Schema, model } = mongoose;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((e) => {
    console.error(`error in connecting..err:${e}`);
  });

let userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
  },
  refreshToken: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
});
const productSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  color: String,
  category: String,
  image: String,
});
let User = model("User", userSchema);
let Product = model("Product", productSchema);
module.exports = {
  User,
  Product,
};
