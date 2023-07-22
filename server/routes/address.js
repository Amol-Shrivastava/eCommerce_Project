const router = require("express").Router();

const {
  addAddress,
  deleteAddress,
  updateAddress,
  viewAllAddressOfUser,
} = require("../middleware/address");
console.log("inside address router");
router
  .get("/getAllAddress", viewAllAddressOfUser)
  .post("/createAddress", addAddress)
  .delete("/deleteAddress/:addressId", deleteAddress)
  .patch("/updateAddress/:addressId", updateAddress);

module.exports = router;
