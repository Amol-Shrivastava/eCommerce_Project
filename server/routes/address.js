const {
  addAddress,
  deleteAddress,
  updateAddress,
  viewAllAddressOfUser,
} = require("../middleware/address");
const router = require("express").Router();

router.post("/createAddress/:userId", addAddress);
router.delete("/deleteAddress/:addressId/:userId", deleteAddress);
router.patch("/updateAddress/:addressId/:userId", updateAddress);
router.get("/getAllAdress/:userId", viewAllAddressOfUser);

module.exports = router;
