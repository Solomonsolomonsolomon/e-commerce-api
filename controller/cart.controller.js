const { User, Cart, Product } = require("./../model/db");
const mongoose = require("mongoose");
const { Schema, Mongoose } = require("mongoose");

//addNewProduct();
function addNewProduct() {
  new Product({
    category: "shoes",
    size: "L",
    image: "base64",
    color: "yellow",
    quantity: 10,
    name: "testprod1",
  }).save();
}


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
  const { quantity, color, size } = await req.body;
  const { userId, productId } = req.params;

  Cart.findOne({ userId })
    .then(async (cart) => {
      let productClone;
      let cartClone;
      let newCart;
      let product;
      if (!cart) {
        //#if cart doesnt for user with this particular id,create it
        try {
          product = await Product.findOne({ _id: productId });
          let USER = new mongoose.Types.ObjectId(userId);
          let PRODUCT = new mongoose.Types.ObjectId(productId.trim());
          newCart = new Cart({
            userId: USER,
            items: [
              {
                product: PRODUCT,
                quantity,
                size,
                color,
              },
            ],
          });

          cartClone = (await newCart) ? newCart : null;
          productClone = product ? { ...product._doc } : null;
          if (product.quantity < quantity) {
            throw new Error("insufficient stocks left for particular product,");
          }
          product.quantity -= quantity;
          await newCart.save();
          await product.save();
          return res.status(200).json({ msg: "added to cart successfully" });
        } catch (err) {
          //#rollback changes
          if (newCart && cartClone) {
            // await Cart.findOneAndRemove({ items: newCart.items });
          }

        
          return res.status(400).json({ err: err.message });
        }
      }
      //#else just append new item
      else {
        let prod;
        let myCartClone;
        let myProdClone;
        try {
          myCartClone = cart ? { ...cart._doc } : null;
          cart.items.push({
            product: new mongoose.Types.ObjectId(productId),
            quantity,
            size,
            color,
          });
          prod = await Product.findOne({ _id: productId });
          myProdClone = myProdClone ? { ...prod._doc } : null;
          if (!prod) {
            throw new Error("product doesn't exist");
          }
          if (prod.quantity < quantity) {
            throw new Error("insufficient stocks for particular product");
          }
          prod.quantity -= quantity; 
          await cart.save();
          await prod.save();
          return res.status(200).json({ msg: "added to cart successfully" });
        } catch (err) {
          //#rollback changes
         
          // Object.assign(cart, myCartClone);
          //await cart.save()
          //await Cart.findOneAndRemove({ items: cart.items });

        
          return res.status(400).json({ msg: err.message });
        }
      }
    })
    .catch((err) => {
      return res.status(400).json({ msg: err.message });
    });
};

module.exports.emptyCart = async (req, res) => {
  let queries = [];
  const { userId } = req.params;
  try {
    await Cart.findOne({ userId }).then(async (cartItem) => {
      if (!cartItem) {
        throw new Error("Cart is already empty");
      }
      console.log(cartItem.items.length);
      for (i in cartItem.items) {
        queries.push({
          updateOne: {
            filter: { _id: cartItem.items[i].product },
            update: { $inc: { quantity: cartItem.items[i].quantity } },
          },
        });
      }

      Product.bulkWrite(queries).then(async () => {
        await Cart.findOneAndRemove({ userId })
          .then((e) => {
            if (!e) {
              return res.status(404).json({ msg: "cart already empty" });
            }
            return res.status(200).json({ msg: "cart emptied successfully" });
          })
          .catch((err) => {
            return res.status(500).json({ msg: "an error occured" });
          });
      });
    });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

module.exports.removeItemsFromCart = async (req, res) => {
  const { userId, id } = await req.params;

  try {
    await Cart.findOne({ userId }).then(async (cart) => {
      if (!cart) {
        throw new Error("cart is already empty");
      }

      if (cart.items.length > 1) {
        let index = await cart.items.findIndex((e) => {
          return e._id == id;
        });
        console.log(index);

        if (index !== -1) {
         // let prod = cart.items[index].product;
          cart.items.splice(index, 1);
          await Product.findOne({ _id: await cart.items[index].product}).then(async (e) => {
            if (!e) {
              throw new Error(
                "product you are trying to delete either doesnt exist or already deleted"
              );
            }
            e.quantity += cart.items[index].quantity;
            await e.save();
            await cart.save();
            return res.status(200).json({msg:"removed item successfully from cart"})
          });
        } else {
          throw new Error("either item doesnt exist or item already deleted");
        }
      } else {
        this.emptyCart(req, res);
      }
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }

  //   Cart.findOne({ userId }).then((cart) => {
  //     if (!cart) {
  //       return res.status(404).json({ msg: "cart is already empty" });
  //     }

  //     if (cart.items.length > 1) {
  //       let index = cart.items.findIndex((_id) => {
  //         return _id._id == id;
  //       });

  //       if (index !== -1) {
  //         cart.items.splice(index, 1);
  //         cart
  //           .save()
  //           .then((e) => {
  //             return res
  //               .status(200)
  //               .json({ msg: "cart item removed successfully" });
  //           })
  //           .catch((err) => {
  //             return res.status(400).json({ msg: err.message });
  //           });
  //       } else {
  //         res
  //           .status(400)
  //           .json({ msg: "either item already deleted or item doesnt exist" });
  //       }
  //     } else {
  //       Cart.findOneAndRemove({ userId })
  //         .then((e) => {
  //           if (!e) {
  //             return res.status(400).json({ msg: "cart already empty" });
  //           }
  //           return res.status(200).json({ msg: "cart emptied successfully" });
  //         })
  //         .catch((err) => {
  //           res.status(400).json({ msg: err.message });
  //         });
  //     }
  //   });
};
