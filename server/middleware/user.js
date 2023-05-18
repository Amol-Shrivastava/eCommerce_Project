const consola = require("consola");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const userModel = require("../models/userSchema");
const addressModel = require("../models/addressSchema");

const registerHandler = async (req, res) => {
  const {
    name,
    email,
    password,
    number,
    street,
    houseNumber,
    city,
    state,
    pincode,
  } = req.body;

  try {
    if (
      !name ||
      !email ||
      !password ||
      !number ||
      !street ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Please fill all the required informations",
      });
    }

    const existingUserCheck = await userModel.findOne({ email });
    if (existingUserCheck) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, msg: `User already exists` });
    }

    const addressDoc = new addressModel({
      street,
      houseNumber,
      city,
      state,
      pincode,
    });
    const createdAddress = await addressDoc.save();
    const userDoc = new userModel({
      name,
      email,
      number,
      password,
      createdAddress,
    });

    await userDoc.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, msg: `User successfully created` });
  } catch (error) {
    if (error.name == "ValidationError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Please fill all the required information",
      });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error });
  }
};

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: `Login credentials missing` });
    }

    const userFound = await userModel.findOne({ email });
    if (!userFound)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: `No user exists for given credentials` });

    const verifyPassword = await bcrypt.compare(password, userFound.password);
    if (!verifyPassword)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, msg: `Invalid email or password` });

    const userPayload = {
      email: userFound.email,
      name: userFound.name,
      id: userFound._id,
    };

    const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1m",
    });

    const refreshToken = jwt.sign(
      userPayload,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res
      .status(StatusCodes.ACCEPTED)
      .json({ success: true, msg: accessToken });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

const authHandler = async (req, res, next) => {
  const tokenString = req.headers.authorization || req.headers.Authorization;

  try {
    if (!tokenString?.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, msg: "Please login again" });
    }
    const token = tokenString.split(" ")[1];

    const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      email: verifyToken.email,
      name: verifyToken.name,
      userId: verifyToken.id,
    };

    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, msg: error.message });
  }
};

const refreshTokenHandler = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, msg: "NO cookies found" });
  } else {
    return res.status(StatusCodes.OK).json({ success: true, msg: cookies.jwt });
  }
  /*
  try {
    const verifyRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const checkUser = await userModel.findOne({
      email: verifyRefreshToken.email,
    });
    if (!checkUser)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, msg: `Unauthorized` });

    const userPayload = {
      email: checkUser.email,
      name: checkUser.name,
      id: checkUser._id,
    };

    const newToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });

    return res.status(StatusCodes.OK).json({ success: true, msg: newToken });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
  */
};

const logoutHandler = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: `Successfully logged out.` });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: error.message });
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  authHandler,
  logoutHandler,
  refreshTokenHandler,
};
