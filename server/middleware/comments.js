const consola = require("consola");
const commentModel = require("../models/commentSchema");
const { StatusCodes } = require("http-status-codes");

const viewAllCommentsForProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    const commentsArr = await commentModel
      .find({ product_id })
      .populate("product_id")
      .populate("commentedBy")
      .limit(10);
    if (!commentsArr)
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "No comments were found for this product",
      });

    return res.status(StatusCodes.OK).json({ success: true, msg: commentsArr });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const addComment = async (req, res) => {
  const { product_id, userId } = req.params;
  const { description } = req.body;
  try {
    if (!description)
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "You cannot post blank comment for a product",
      });

    let newComment = await commentModel({
      product_id,
      description,
      commentedBy: userId,
    });
    await newComment.save();

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: "Comment Successfully posted" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { newCommentDescription } = req.body;

    const commentExist = await categoryModel.findOne({ _id: comment_id });

    if (!commentExist) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Category does not exists." });
    }

    commentExist.description = newCommentDescription;
    await commentExist.save();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Comment has been successfull updated" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const findSingleComment = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const comment = await commentModel.findOne({ _id: comment_id });
    if (!comment)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "comment doesnot exists" });

    return res.status(StatusCodes.OK).json({ success: true, msg: comment });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const comment = await commentModel.findByIdAndDelete(comment_id);
    if (!comment)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Mentioned comment not found" });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "comment successfully deleted" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

module.exports = {
  viewAllCommentsForProduct,
  addComment,
  updateComment,
  findSingleComment,
  deleteComment,
};
