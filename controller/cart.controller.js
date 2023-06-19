const { User, Cart, Product } = require("./../model/db");
const mongoose = require("mongoose");
const { Schema, Mongoose } = require("mongoose");

module.exports.getCartItems = async (req, res) => {
  const { userId } = req.params;
  Cart.findOne({ userId })
    .populate("items.product")
    .exec()
    .then(async (cartItems) => {
      if (!cartItems) {
        return res.status(404).json({ msg: "you do not have any cart items" });
      }
      res.status(200).json(cartItems);
    })
    .catch((err) => {
      res.status(400).json({ msg: err.message });
    });
};

module.exports.addToCart = async (req, res) => {
  const { quantity, color, size } = req.body;
  const { userId, productId } = req.params;

  Cart.findOne({ userId })
    .then((cart) => {
      console.log(cart);
      if (!cart) {
        //if cart doesnt exist for user,create it
        new Cart({
          userId: new mongoose.Types.ObjectId(userId),
          items: [
            {
              product: new mongoose.Types.ObjectId(productId),
              quantity,
              size,
              color,
            },
          ],
        })
          .save()
          .then((e) => {
            return res
              .status(201)
              .json({ msg: "cart item added", cartId: e._id });
          })
          .catch((err) => {
            return res.status(400).json({ msg: err.message });
          });
      } //else just append new Item
      else {
        console.log("else hit");
        cart.items.push({
          product: new mongoose.Types.ObjectId(productId),

          quantity,
          size,
          color,
        });
        cart
          .save()
          .then((e) => {
            return res
              .status(201)
              .json({ msg: "cart item added", cartId: e._id });
          })
          .catch((err) => {
            return res.status(400).json({ msg: err.message });
          });
      }
    })
    .catch((err) => {
      return res.status(400).json({ msg: err.message });
    });
};

module.exports.emptyCart = async (req, res) => {
  const { userId } = req.params;
  Cart.findOneAndRemove({ userId }).then((e) => {
    if (!e) {
      return res.status(404).json({ msg: "cart is already empty" });
    }
    return res.status(200).json({ msg: "emptied cart successfully" });
  });
};

module.exports.removeItemsFromCart = async (req, res) => {
  const { userId, id } = req.params;
  Cart.findOne({ userId }).then((cart) => {
    if (!cart) {
      return res.status(404).json({ msg: "cart is already empty" });
    }

    if (cart.items.length > 1) {
      let index = cart.items.findIndex((_id) => {
        return _id._id == id;
      });

      if (index !== -1) {
        cart.items.splice(index, 1);
        cart
          .save()
          .then((e) => {
            return res
              .status(200)
              .json({ msg: "cart item removed successfully" });
          })
          .catch((err) => {
            return res.status(400).json({ msg: err.message });
          });
      } else {
        res
          .status(400)
          .json({ msg: "either item already deleted or item doesnt exist" });
      }
    } else {
      Cart.findOneAndRemove({ userId })
        .then((e) => {
          if (!e) {
            return res.status(400).json({ msg: "cart already empty" });
          }
          return res.status(200).json({ msg: "cart emptied successfully" });
        })
        .catch((err) => {
          res.status(400).json({ msg: err.message });
        });
    }
  });
};
