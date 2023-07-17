const { StatusCodes } = require("http-status-codes");
const { checkForFalsy } = require("../util/validate");
const userModel = require("../models/userSchema");
const addressModel = require("../models/addressSchema");

const addAddress = async (req, res) => {
  const { street, houseNumber, city, state, pincode } = req.body;
  const { userId: belongsTo } = req.params;
  try {
    if (!checkForFalsy(street, city, state, pincode)) {
      const user = await _checkUserAndAddress(belongsTo, "user");
      if (!user)
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          msg: "User does not exists for address creation",
        });

      const newAddress = await addressModel({
        street,
        houseNumber,
        city,
        state,
        pincode,
        belongsTo,
      });

      await newAddress.save();
      return res
        .status(StatusCodes.CREATED)
        .json({ success: true, msg: "New Address Created." });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Please fill all the mandatory informations.",
      });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const updateAddress = async (req, res) => {
  const { street, houseNumber, city, state, pincode } = req.body;
  const { addressId, userId: belongsTo } = req.params;
  try {
    const existingAddress = await _checkUserAndAddress(addressId, "address");
    const existingUser = await _checkUserAndAddress(belongsTo, "user");
    if (!existingAddress || !existingUser)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Given address or user does not exists" });

    existingAddress.street = street ?? existingAddress.street;
    existingAddress.houseNumber = houseNumber ?? existingAddress.houseNumber;
    existingAddress.city = city ?? existingAddress.city;
    existingAddress.state = state ?? existingAddress.state;
    existingAddress.pincode = pincode ?? existingAddress.strpincodeeet;

    await existingAddress.save();
    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Address is updated" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const viewAllAddressOfUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await _checkUserAndAddress(userId, "user");
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "User does not exists" });

    const addressArr = await addressModel.find({ belongsTo: userId });
    if (addressArr.length == 0)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "No Address saved for this user." });

    return res.status(StatusCodes.OK).json({ success: true, msg: addressArr });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const deleteAddress = async (req, res) => {
  const { addressId, userId } = req.params;

  try {
    const user = await _checkUserAndAddress(userId, "user");
    const address = await _checkUserAndAddress(addressId, "address");

    if (!user || !address)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Given address/user does not exists." });

    await addressModel.findByIdAndDelete(addressId);

    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Address is deleted successfully." });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const _checkUserAndAddress = async (id, type) => {
  try {
    if (type == "user") {
      const user = await userModel.findOne({ _id: id });
      if (!user) return false;

      return user;
    } else if (type == "address") {
      const address = await addressModel.findOne({ _id: id });
      if (!address) return false;

      return address;
    }
    return true;
  } catch (error) {
    consola.error(error.message);
    return false;
  }
};

module.exports = {
  addAddress,
  updateAddress,
  deleteAddress,
  viewAllAddressOfUser,
};
