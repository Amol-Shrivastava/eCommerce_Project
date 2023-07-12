const router = require("express").Router();

const {
  viewAllCategory,
  addCategory,
  updateCategory,
  findSingleCategory,
  deleteCategory,
} = require("../middleware/category");

router
  .post("/addCategory", addCategory)
  .get("/allCategory", viewAllCategory)
  .get("/findcategory/:category_id", findSingleCategory)
  .patch("/updateCategory/:category_id", updateCategory)
  .delete("/deleteCategory/:category_id", deleteCategory);

module.exports = router;
