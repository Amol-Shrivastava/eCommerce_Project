const { StatusCodes } = require("http-status-codes");
const userModel = require("../models/userSchema");
const addressModel = require("../models/addressSchema");
const { checkForFalsy } = require("../util/validate");

const getUserAddress = async (req, res) => {
  const { userId } = req.params;
  try {
    const addressArr = await userModel.find({ _id: userId }).populate({
      path: "address",
      strictPopulate: false,
    });
    return res.status(StatusCodes.OK).json({ success: true, msg: addressArr });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const getSpecificAddress = async (req, res) => {
  const { userId, addressId } = req.params;

  try {
    const address = await userModel
      .find({ _id: userId }, "-password")
      .populate({
        path: "address",
        match: {
          _id: addressId,
        },
      });

    return res.status(StatusCodes.OK).json({ success: true, msg: address });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

module.exports = {
  getSpecificAddress,
  getUserAddress,
};
