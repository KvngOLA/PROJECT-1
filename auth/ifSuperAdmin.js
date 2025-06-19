const UserService = require("../services/user.service");

const ifSuperAdmin = async (req, res, next) => {
  try {
    const email = req.user.email;
    const userExists = await UserService.findOne(email);
    if (userExists.role != "super_admin") {
      return res
        .status(401)
        .json({ message: "This End Point is for Super Admins only" });
    }
    next();
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

module.exports = ifSuperAdmin;
