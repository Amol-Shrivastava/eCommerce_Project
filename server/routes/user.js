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
router.get("/refreshToken", refreshTokenHandler);
router.get("/check", authHandler, async (req, res) =>
  res.status(StatusCodes.OK).json({ success: true, msg: `Protected Route` })
);
router.get("/logout", authHandler, logoutHandler);

module.exports = router;
