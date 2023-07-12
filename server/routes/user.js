const router = require("express").Router();
const { StatusCodes } = require("http-status-codes");
const {
  registerHandler,
  loginHandler,
  authHandler,
  logoutHandler,
  refreshTokenHandler,
} = require("../middleware/user");

router.post("/register", registerHandler);
router.post("/login", loginHandler);
// router.get("/auth", authHandler);
router.get("/refreshToken", refreshTokenHandler);
router.get("/logout", logoutHandler);

module.exports = router;
