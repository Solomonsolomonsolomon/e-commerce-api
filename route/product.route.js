const { Router } = require("express");

const {
  getProducts,
  getSingleProduct,
  updateProduct,
  postProduct,
  deleteProduct,
  sortByPopular,
  increaseProductsViews,
} = require("./../controller/product.controller");

const router = Router();

router.get("/products", getProducts);
router.get("/products/:id", getSingleProduct);
router.post("/products/update/:id", updateProduct);
router.post("/products/new", postProduct);
router.post("/products/delete/:id", deleteProduct);
router.get("/products/get/popular", sortByPopular);
router.get("/products/viewcount/:_id", increaseProductsViews);
module.exports = router;
