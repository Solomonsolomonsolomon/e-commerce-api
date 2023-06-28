const mongoose = require("mongoose");
const { Schema, model } = mongoose;
mongoose
  .connect("mongodb://localhost:27017/jwt001")
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
  color: [String],
  size: [String],
  category: [String],
  image: String,
  quantity: Number,
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
          min: 0,
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
const orderSchema = new Schema(
  {
    price: Number,
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    currency: {
      type: String,
      default: "NGN",
    },
    gateway: {
      type: String,
      default: "paystack",
    },
  },
  { timestamps: true }
);
let User = model("User", userSchema);
let Product = model("Product", productSchema);
let Cart = model("Cart", cartSchema);
let Order = model("Order", orderSchema);
module.exports = {
  User,
  Product,
  Cart,
  Order,
};
