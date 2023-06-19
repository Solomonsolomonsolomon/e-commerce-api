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
  quantity: String,
});
const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

let User = model("User", userSchema);
let Product = model("Product", productSchema);
let Cart = model("Cart", cartSchema);
module.exports = {
  User,
  Product,
  Cart,
};
