const CommentService = require("../services/comment.service");
const PostService = require("../services/post.service");
const UserService = require("../services/user.service");
const bcrypt = require("bcrypt");
const LikeService = require("../services/like.service");
const FollowService = require("../services/follow.service");
const generateJwt = require("../utils/generateToken");

const superAdminLogin = async (req, res) => {
  //state all required data to b inputted
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(409).json({ message: "Please fill all required fields" });
  }
  try {
    const userExists = await UserService.findOne(email);
    //check if user exists
    if (!userExists) {
      return res.status(400).json({ message: "This user does not exist" });
    }
    //check if super_admin
    if (userExists.role != "super_admin") {
      return res.status(409).json({ message: "Only admin accounts can login" });
    }

    //check is the inputted password is correct
    const validPassword = await bcrypt.compare(password, userExists.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //create and store token in a cookie
    const payload = { id: userExists.id, email: userExists.email };
    const token = generateJwt(payload);

    res.cookie("token", token, { httpOnly: true, secure: false });

    return res.status(200).json({ message: "Logged in successfully", token });
  } catch (err) {
    // console.log(err);
    res.status(404).json({ err: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userName = req.params.name;

    //check if user exists
    const userExists = await UserService.findByName(userName);
    if (!userExists) {
      return res.status(401).json({ message: "This user does not exist" });
    }

    //check if its an admin you are trying to delete
    if (userExists.role == "super_admin") {
      return res
        .status(409)
        .json({ messaege: "You are not authorized to delete this user" });
    }

    //check for posts, comments, likes, following associated to the user and delete
    const userId = userExists.id;
    const userEmail = userExists.email;

    //for following
    await FollowService.hardDeleteMany(userId);

    //for likes
    await LikeService.hardDeleteMany(userId);

    //for comments
    await CommentService.hardDeleteMany(userId);

    //for posts
    await PostService.hardDeleteMany(userId);

    //soft delete user
    const data = {
      isVerified: false,
    };
    await UserService.update(userEmail, data);

    return res
      .status(200)
      .json({ message: "The user has been deleted sucessfully" });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

module.exports = {
  superAdminLogin,
  deleteUser,
};
