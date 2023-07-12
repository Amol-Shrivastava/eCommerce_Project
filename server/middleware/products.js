const consola = require("consola");
const productModel = require("../models/productSchema");
const { StatusCodes } = require("http-status-codes");

const viewAllProducts = async (req, res) => {
  try {
    const productsArr = await productModel.sort({ createdAt: -1 }).limit(10);
    return res.status(StatusCodes.OK).json({ success: true, msg: productsArr });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const viewAllProductsUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const productsArr = await productModel
      .find({ dealer: userId })
      .sort({ createdAt: -1 })
      .limit(10);
    return res.status(StatusCodes.OK).json({ success: true, msg: productsArr });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const viewAllProductsForCategory = async (req, res) => {
  const { category_id } = req.params;
  try {
    const productsArr = await productModel
      .find({ category: category_id })
      .sort({ createdAt: -1 })
      .limit(10);
    return res.status(StatusCodes.OK).json({ success: true, msg: productsArr });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, unit, currency, category } = req.body;
    const newProduct = new productModel();

    if (req.files.length > 0) {
      req.files.forEach(({ originalname, buffer, mimetype }) => {
        let imgObj = {
          name: originalname,
          image: {
            data: buffer,
            contentType: mimetype,
          },
        };

        newProduct.product_images.push(imgObj);
      });
    }

    // consola.info(finalImgArr);
    const productExist = await productModel.findOne({ product_name: name });
    if (productExist)
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "A product already exists with this name",
      });

    // consola.info(newProduct.product_images);
    newProduct.product_name = name;
    newProduct.product_description.push(description);
    newProduct.price = price;
    newProduct.unit = unit;
    newProduct.currency = currency;
    newProduct.category = category;

    await newProduct.save();

    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: `Product created successfully` });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { name, description, price, unit, currency, category } = req.body;

    const productExist = await productModel.findOne({ _id: product_id });
    if (!productExist) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Product does not exists." });
    }

    productExist.product_name = name ?? productExist.product_name;
    productExist.product_description =
      description ?? productExist.product_description;
    productExist.price = price ?? productExist.price;
    productExist.unit = unit ?? productExist.unit;
    productExist.currency = currency ?? productExist.currency;
    productExist.category = category ?? productExist.category;
    await productExist.save();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Product details have been updated" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const findSingleProduct = async (req, res) => {
  const { product_id } = req.params;

  try {
    const product = await productModel.findOne({ _id: product_id });
    if (!product)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Product doesnot exists" });

    return res.status(StatusCodes.OK).json({ success: true, msg: product });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    const product = await productModel.findByIdAndDelete(product_id);
    if (!product)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Mentioned Product not found" });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Product successfully deleted" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

module.exports = {
  viewAllProducts,
  viewAllProductsUser,
  viewAllProductsForCategory,
  addProduct,
  updateProduct,
  findSingleProduct,
  deleteProduct,
};
