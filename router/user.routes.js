const express = require("express");
const router = express.Router();
const upload = require("../fileupload/multer");
const {
  userSignUp,
  homePage,
  loginUser,
  userProfile,
  updateProfile,
  deleteProfile,
  userVerification,
  forgotPassword,
  resetPassword,
  getNewOtp,
} = require("../controller/user.controller");
const verifyUser = require("../auth/auth");

router.get("/", homePage);

router.post("/signup", upload.single("file"), userSignUp);

router.post("/login", loginUser);

router.get("/resendOtp", verifyUser, getNewOtp);

router.get("/profile", verifyUser, userProfile);

router.put("/update", upload.single("file"), verifyUser, updateProfile);

router.patch("/delete", verifyUser, deleteProfile);

router.post("/verify", verifyUser, userVerification);

router.post("/forgotPassword", forgotPassword);

router.patch("/resetPassword", verifyUser, resetPassword);

// router.delete("/alldel", async (req, res) => {
//   try {
//     const deleteResponse = await prisma.users.deleteMany({
//       where: {
//         id: {
//           gte: 1,
//         },
//       },
//     });
//     console.log(deleteResponse);
//     return res.json({ message: "All users deleted" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to delete users" });
//   }
// });

module.exports = router;
