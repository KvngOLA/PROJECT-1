const express = require("express");
const verifyUser = require("../auth/auth");
const router = express.Router();
const {
  getComments,
  createComment,
  softDelete,
  updatedComments,
  getCommentById,
} = require("../controller/comment.controller");

router.get("/get/:title", verifyUser, getComments);

router.get("/comment/:id", getCommentById);

router.post("/create/:title", verifyUser, createComment);

router.patch("/delete/:id", verifyUser, softDelete);

router.put("/update/:id", verifyUser, updatedComments);

module.exports = router;
