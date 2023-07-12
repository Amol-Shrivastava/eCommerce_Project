const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();

const {
  addProduct,
  viewAllProducts,
  viewAllProductsForCategory,
  updateProduct,
  deleteProduct,
  findSingleProduct,
  viewAllProductsUser,
} = require("../middleware/products");

const upload = multer(storage);

router
  .post("/addProduct", upload.array("avatar", 3), addProduct)
  .get("/categoryWiseProduct/:category_id", viewAllProductsForCategory)
  .get("/allProducts/:userId", viewAllProductsUser)
  .get("/allProducts/", viewAllProducts)
  .get("/findProduct/:product_id", findSingleProduct)
  .patch("/updateProduct/:product_id", updateProduct)
  .delete("/deleteProduct/:product_id", deleteProduct);

module.exports = router;
