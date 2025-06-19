const express = require("express");
const verifyUser = require("../auth/auth");
const {
  getFollowingStatus,
  getFollowersStatus,
  follow,
} = require("../controller/follow.controller");
const router = express.Router();

router.get("/following", verifyUser, getFollowingStatus);

router.get("/followers", verifyUser, getFollowersStatus);

router.post("/follow/:name", verifyUser, follow);

module.exports = router;
