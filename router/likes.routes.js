const express = require("express");
const router = express.Router();
const verifyUser = require("../auth/auth");
const { getLikeStatus, likePost } = require("../controller/likes.controller");

router.get("/likes/:title", verifyUser, getLikeStatus);

router.post("/like/:title", verifyUser, likePost);

module.exports = router;
