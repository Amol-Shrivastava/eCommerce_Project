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
  updateProductImage,
} = require("../middleware/products");

const upload = multer(storage);

router
  .post("/addProduct", upload.array("avatar", 3), addProduct)
  .patch(
    "/updateProductImage/:productId/:imageName",
    upload.single("avatar", 1),
    updateProductImage
  )
  .get("/categoryWiseProduct/:category_id", viewAllProductsForCategory)
  .get("/allProductsUser/:userId", viewAllProductsUser)
  .get("/allProducts/", viewAllProducts)
  .get("/findProduct/:product_id", findSingleProduct)
  .patch("/updateProduct/:product_id", updateProduct)
  .delete("/deleteProduct/:product_id", deleteProduct);

module.exports = router;
