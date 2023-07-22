const router = require("express").Router();

const {
  viewAllCommentsForProduct,
  addComment,
  updateComment,
  findSingleComment,
  deleteComment,
} = require("../middleware/comments");

router
  .post("/addComment", addComment)
  .get("/allComments/:product_id", viewAllCommentsForProduct)
  .get("/viewComment/:comment_id", findSingleComment)
  .patch("/updateComment/:comment_id", updateComment)
  .delete("/deleteComment/:comment_id", deleteComment);

module.exports = router;
