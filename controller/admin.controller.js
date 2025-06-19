const UserService = require("../services/user.service");
const PostService = require("../services/post.service");
const CommentService = require("../services/comment.service");
const generateJwt = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const cloudinary = require("../cloudinary/cloudinary");

const adminLogin = async (req, res) => {
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
    //check if admin
    if (userExists.role != "admin") {
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
    if (userExists.role == "admin") {
      return res
        .status(409)
        .json({ messaege: "You are not authorized to delete this user" });
    }

    //delete user
    await UserService.hardDelete(userName);

    return res
      .status(200)
      .json({ message: "The user has been deleted sucessfully" });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postTitle = req.params.title;

    //check if postExists
    const postExists = await PostService.findOne(postTitle);
    if (!postExists) {
      return res.status(401).json({ messaege: "This post does not exist" });
    }

    //delete post
    await PostService.hardDelete(postTitle);

    return res
      .status(200)
      .json({ messaege: "The post has been deleted successfully" });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const intId = req.params.id;
    const commentId = parseFloat(intId);

    //check if comment Exists
    const commentExists = await CommentService.findOne(commentId);
    if (!commentExists) {
      return res.status(401).json({ messaege: "This comment does not exist" });
    }

    //delete comment
    await CommentService.hardDelete(commentId);

    return res
      .status(200)
      .json({ messaege: "The comment has been deleted successfully" });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    //state nessary parameters
    const title = req.params.title;
    const { description, tags } = req.body;
    const file = req.file.path;
    const upload = await cloudinary.v2.uploader.upload(file);

    //find post using title
    const post = await PostService.findOne(title);

    //check if post exists
    if (!post.active || !post) {
      return res.status(400).json({ message: "This post does not exist" });
    }

    //update post
    const postData = {
      description,
      tags,
      picture: upload.secure_url,
    };

    const updatePost = await PostService.update(title, postData);

    return res
      .status(200)
      .json({ message: "Updated successfully", result: updatePost });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const updateComments = async (req, res) => {
  try {
    //state params
    const id = req.params.id;
    const intId = parseFloat(id);
    const comment = req.body.comment;

    //find comment
    const author = await CommentService.findOne(intId);

    //if comment exists
    if (!author || !author.active) {
      return res.status(400).json({ message: "This comment does not exist" });
    }
    //update the comment

    const data = {
      comment: comment,
    };
    const updatedComments = await CommentService.update(intId, data);

    return res.status(200).json({
      message: "The comment has been updated successfully",
      result: updatedComments,
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

const totalUsers = async (req, res) => {
  try {
    //pagination
    const pageSize = req.query.limit || 10;
    const page = Number(req.query.page) || 1;
    const count = await UserService.count();

    const totalUsers = await UserService.findMany(pageSize, page);

    return res.status(200).json({
      result: `There are ${count} active users`,
      messaege: totalUsers,
      page: page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.messaege });
  }
};

const totalPosts = async (req, res) => {
  try {
    //pagination
    const pageSize = req.query.limit || 10;
    const page = Number(req.query.page) || 1;
    const count = await PostService.count();

    const totalPosts = await PostService.findMany(pageSize, page);

    return res.status(200).json({
      result: `There are ${count} active posts`,
      messaege: totalPosts,
      page: page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.messaege });
  }
};

const totalComments = async (req, res) => {
  try {
    //pagination
    const pageSize = req.query.limit || 10;
    const page = Number(req.query.page) || 1;
    const count = await CommentService.countAll();

    const totalComments = await CommentService.findAll(pageSize, page);

    return res.status(200).json({
      result: `There are ${count} active comments`,
      messaege: totalComments,
      page: page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ err: err.messaege });
  }
};

module.exports = {
  adminLogin,
  deleteUser,
  deletePost,
  deleteComment,
  updatePost,
  updateComments,
  totalUsers,
  totalPosts,
  totalComments,
};
