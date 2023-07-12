const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const userModel = require("../models/userSchema");
const addressModel = require("../models/addressSchema");
const { checkForFalsy } = require("../util/validate");

/**
 * Function to create a new user
 * @returns Promise for creation of new user
 */
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
      !checkForFalsy(
        name,
        email,
        password,
        number,
        street,
        city,
        state,
        pincode
      )
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Please fill all the required informations",
      });
    }

    const existingUserCheck = await userModel.findOne({ email });
    if (existingUserCheck) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        msg: `User already exists`,
      });
    }

    const createdAddress = await _makeAddress(
      street,
      houseNumber,
      city,
      state,
      pincode
    );

    const userDoc = new userModel({
      name,
      email,
      number,
      password,
      createdAddress,
    });

    await userDoc.save();
    return res.status(StatusCodes.CREATED).json({
      success: true,
      msg: `User successfully created`,
    });
  } catch (error) {
    if (error.name == "ValidationError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Please fill all the required information",
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error,
    });
  }
};

/**
 * Function to create new Address
 *
 * @param {String} street
 * @param {String} houseNumber
 * @param {String} city
 * @param {String} state
 * @param {String} pincode
 * @returns promise to save new created address
 */
const _makeAddress = async (street, houseNumber, city, state, pincode) => {
  const addressDoc = new addressModel({
    street,
    houseNumber,
    city,
    state,
    pincode,
  });
  return await addressDoc.save();
};

/**
 *
 * @param {String} email
 * @returns Promise with User object if it exists otherwise error message string
 */
const _getUserDetails = async (email) => {
  const userFound = await userModel.findOne({ email });
  if (!userFound) return { err: `No user exists for given credentials` };

  return userFound;
};

/**
 *
 * @param {password submitted by user: String} password
 * @param {password found in userObject: String} correctPassword
 * @returns promise resolving with true if both passwords are matching otherwise false
 */
const _verifyPassword = async (password, correctPassword) => {
  const verifyPassword = await bcrypt.compare(password, correctPassword);
  if (!verifyPassword) return false;

  return true;
};

/**
 * Function to generate tokens
 * @param {user details object} userFound
 * @returns promise resolving with accessToken and refreshToken object
 */
const _tokenGeneration = async (userFound) => {
  const userPayload = {
    email: userFound.email,
    name: userFound.name,
    id: userFound._id,
  };

  const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};

/**
 * Function handling the login logic
 * @returns promise resolving with accessToken and refreshToken once login is successful
 */
const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!checkForFalsy(email, password)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: `Login credentials missing`,
      });
    }

    const userFound = await _getUserDetails(email);
    if (checkForFalsy(userFound.err)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: userFound.err });
    }

    const verifyPassword = _verifyPassword(password, userFound.password);
    if (!verifyPassword)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: `Invalid email or password`,
      });

    const { accessToken, refreshToken } = await _tokenGeneration(userFound);

    return res.status(StatusCodes.ACCEPTED).json({
      success: true,
      msg: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
  }
};

/**
 * Function to verify authorization
 * @returns middleware calls other middleware only when the req is having correct authorization token
 */
const authHandler = async (req, res, next) => {
  const tokenString = req.headers.authorization || req.headers.Authorization;

  try {
    if (!tokenString?.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Please login again",
      });
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
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      msg: error.message,
    });
  }
};

const refreshTokenHandler = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      msg: "NO cookies found",
    });

  return res.status(StatusCodes.OK).json({
    success: true,
    msg: cookies.jwt,
  });
};

const logoutHandler = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: `Successfully logged out.`,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  authHandler,
  logoutHandler,
  refreshTokenHandler,
};
