const router = require("express").Router();
const { getUserAddress, getSpecificAddress } = require("../middleware/user");

router
  .get("/allAddress/:userId", getUserAddress)
  .get("/address/:userId/:addressId", getSpecificAddress);

module.exports = router;
