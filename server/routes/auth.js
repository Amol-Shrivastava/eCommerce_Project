const router = require("express").Router();
const {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
} = require("../middleware/auth");

router
  .post("/register", registerHandler)
  .post("/login", loginHandler)
  .get("/refreshToken", refreshTokenHandler)
  .get("/logout", logoutHandler);

module.exports = router;
