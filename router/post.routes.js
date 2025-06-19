const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  getPosts,
  createPost,
  softDelete,
  updatePost,
} = require("../controller/post.controller");
const verifyUser = require("../auth/auth");
const upload = require("../fileupload/multer");

router.get("/all", getAllPosts);

router.get("/get/:title", getPosts);

router.post("/create", upload.single("file"), verifyUser, createPost);

router.patch("/delete/:title", verifyUser, softDelete);

router.put("/update/:title", upload.single("file"), verifyUser, updatePost);

// router.delete("/alldel", async (req, res) => {
//   try {
//     const deleteResponse = await prisma.post.deleteMany({
//       where: {
//         userId: {
//           gte: 1,
//         },
//       },
//     });
//     console.log(deleteResponse);
//     return res.json({ message: "All users deleted" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to delete posts" });
//   }
// });

module.exports = router;
