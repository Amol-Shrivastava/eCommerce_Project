const consola = require("consola");
const categoryModel = require("../models/categorySchema");
const { StatusCodes } = require("http-status-codes");

const viewAllCategory = async (req, res) => {
  try {
    const categoryArr = await categoryModel.find({});
    return res.status(StatusCodes.OK).json({ success: true, msg: categoryArr });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryObj = new categoryModel();
    categoryObj.name = name;

    let categorySaved = await categoryObj.save();

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: categorySaved });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { newCategoryVal } = req.body;

    const categoryExist = await categoryModel.findOne({ _id: category_id });

    if (!categoryExist) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Category does not exists." });
    }

    categoryExist.name = newCategoryVal;
    await categoryExist.save();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Category name has been updated" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const findSingleCategory = async (req, res) => {
  const { category_name } = req.params;

  try {
    const category = await categoryModel.findOne({ name: category_name });
    if (!category)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Category doesnot exists" });

    return res.status(StatusCodes.OK).json({ success: true, msg: category });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { category_id } = req.query;

    const category = await categoryModel.findByIdAndDelete(category_id);
    if (!category)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Mentioned category not found" });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Category successfully deleted" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

module.exports = {
  viewAllCategory,
  addCategory,
  updateCategory,
  findSingleCategory,
  deleteCategory,
};
