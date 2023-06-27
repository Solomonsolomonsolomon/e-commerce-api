const { Router } = require("express");

const {
  getProducts,
  getSingleProduct,
  updateProduct,
  postProduct,
  deleteProduct,
} = require("./../controller/product.controller");

const router = Router();

router.get("/products", getProducts);
router.get("/products/:id", getSingleProduct);
router.post("/products/update/:id", updateProduct);
router.post("/products/new", postProduct);
router.post("/products/delete/:id", deleteProduct);
module.exports = router;
