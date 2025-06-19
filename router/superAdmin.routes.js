const express = require("express");
const {
  superAdminLogin,
  deleteUser,
} = require("../controller/superAdmin.controller");
const verifyUser = require("../auth/auth");
const router = express.Router();
const ifSuperAdmin = require("../auth/ifSuperAdmin");

router.post("/login", superAdminLogin);

router.post("/delete/:name", verifyUser, ifSuperAdmin, deleteUser);

module.exports = router;
