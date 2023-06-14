const { Product } = require("./../model/db");

module.exports.getProducts = async (req, res) => {
  await Product.find({}).then((e) => {
    res.status(200).json(e);
  });
};

module.exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  await Product.find({ _id: id }).then((e) => {
    if (e) {
      res.status(200).json(e);
    } else {
      res.status(404).json({ msg: " product not found" });
    }
  });
};

module.exports.postProduct = async (req, res) => {
  const { name, description, price, color, size, category, image } = req.body;
  if (name && price && image) {
    new Product({
      name,
      price,
      description,
      image,
      size,
      color,
      category,
    })
      .save()
      .then(() => {
        res.status(200).json({ msg: "new product added successfully" });
      });
  } else {
    res.json(403).json({ msg: "name,price and image are required fields" });
  }
};

module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  
  Product.find({ _id: id }).then((e) => {
    if (!e) res.status(404).json({ msg: "product not found" });

    
  });
};
