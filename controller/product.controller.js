const { Product, Cart } = require("./../model/db");

module.exports.getProducts = async (req, res) => {
  await Product.find({})
    .then((e) => {
      res.status(200).json(e);
    })
    .catch((err) => {
      res.status(400).json({ msg: err.message });
    });
};

module.exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  await Product.find({ _id: id })
    .then((e) => {
      if (e) {
        res.status(200).json(e);
      } else {
        res.status(404).json({ msg: " product not found" });
      }
    })
    .catch((e) => {
      res.status(400).json({ msg: e.message });
    });
};

module.exports.postProduct = async (req, res) => {
  const { name, description, price, color, size, category, image, quantity } =
    req.body;
  try {
    if (!price || !name || !image || !quantity) {
      throw new Error("price, image ,quantity and name are required fields");
    }
    if (typeof price !== "number") {
      throw new Error("price type should be type number");
    }
    await new Product({
      name,
      description,
      category,
      image,
      color,
      quantity,
      size,
      price,
    })
      .save()
      .then((e) => {
        res.status(201).json({ msg: "product added successfully" });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
  // if (name && price && image && quantity) {
  //   if (price == NaN) {
  //     return res.status(401).json({ msg: "price should be a number" });
  //   }
  //   new Product({
  //     name,
  //     price: price,
  //     description,
  //     image,
  //     size,
  //     color,
  //     category,
  //     quantity,
  //   })
  //     .save()
  //     .then(() => {
  //       res.status(200).json({ msg: "new product added successfully" });
  //     })
  //     .catch((e) => {
  //       if (e) {
  //         res.status(400).json({ msg: e.message });
  //       }
  //     });
  // } else {
  //   res.status(403).json({
  //     msg: "name,price,quantity and imageURL(base64) are required fields",
  //   });
  // }
};

module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findOne({ _id: id })
      .then(async (prod) => {
        if (!prod) {
          throw new Error("product not found");
        }
        Object.assign(prod, req.body);
       await prod.save().then(() => {
          res.status(200).json({ msg: "product updated successfully" });
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findOne({ _id: id }).then(async (product) => {
      if (!product) {
        throw new Error(
          "either product doesnt exist or product already deleted"
        );
      }
      await Cart.findOne({ [`items.product`]: id }).then(async (e) => {
        let indexes = [];

        if (e) {
          function checkIfProdInCart(action) {
            for (i = e.items.length - 1; i >= 0; i--) {
              if (e.items[i].product == id) {
                action == "splice" ? e.items.splice(i, 1) : indexes.push(i);
              }
            }
          }
          checkIfProdInCart();
          if (indexes.length > 0) {
            if (e.items.length > 1) {
              checkIfProdInCart("splice");
              e.save();
            } else if (e.items.length == 1) {
              await Cart.findOneAndRemove({ userId: e.userId });
            }
          }
        }
      });
      await Product.findOneAndRemove({
        _id: product._id,
      });
      return res.status(200).json({ msg: "product deleted successfully" });
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
