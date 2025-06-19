const express = require("express");
const {
  adminLogin,
  deleteUser,
  deletePost,
  deleteComment,
  updatePost,
  updateComments,
  totalUsers,
  totalPosts,
  totalComments,
} = require("../controller/admin.controller");
const router = express.Router();
const verifyUser = require("../auth/auth");
const ifAdmin = require("../auth/ifAdmin");
const upload = require("../fileupload/multer");

router.post("/login", adminLogin);

router.delete("/delete/user/:name", verifyUser, ifAdmin, deleteUser);

router.delete("/delete/post/:title", verifyUser, ifAdmin, deletePost);

router.delete("/delete/comment/:id", verifyUser, ifAdmin, deleteComment);

router.put("/update/comment/:id", verifyUser, ifAdmin, updateComments);

router.get("/get/users", verifyUser, ifAdmin, totalUsers);

router.get("/get/posts", verifyUser, ifAdmin, totalPosts);

router.get("/get/comments", verifyUser, ifAdmin, totalComments);

router.put(
  "/update/post/:title",
  verifyUser,
  ifAdmin,
  upload.single("file"),
  updatePost
);

module.exports = router;
