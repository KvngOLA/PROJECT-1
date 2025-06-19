const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("../cloudinary/cloudinary");
const jwt = require("jsonwebtoken");
const PostService = require("../services/post.service");

const getAllPosts = async (req, res) => {
  try {
    //pagination
    const pageSize = req.query.limit || 10;
    const page = Number(req.query.page) || 1;
    const count = await PostService.count();

    //find all posts
    const posts = await PostService.findMany(pageSize, page);

    //check is there are no posts
    if (posts.length === 0) {
      return res.status(404).json({ message: "There are no posts available" });
    }

    return res.status(200).json({
      message: "Here are all the posts",
      result: posts,
      page: page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const getPosts = async (req, res) => {
  //get a particular post using the title
  try {
    const { title } = req.params;
    const post = await PostService.findOne(title);

    //check if posts are still active (not soft deleted)
    if (!post || !post.active) {
      return res
        .status(404)
        .json({ message: "No post with that title exists" });
    }
    return res.status(200).json({ result: post });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const createPost = async (req, res) => {
  //state necessary parameters for new post
  const { title, description, tags, active } = req.body;
  //create new post
  try {
    const file = req.file.path;
    const upload = await cloudinary.v2.uploader.upload(file);
    //check if post already exists with title
    const postExists = await PostService.findOne(title);

    if (postExists) {
      return res
        .status(400)
        .json({ message: "A post with this title already exists" });
    }

    //check post owner details from cookie logged in
    const authorId = req.user.id;

    //create new post
    const postData = {
      data: {
        userId: authorId,
        title,
        description,
        tags,
        picture: upload.secure_url,
        active,
      },
    };

    const newPost = await PostService.create(postData);

    return res.status(200).json({ success: true, result: newPost });
  } catch (err) {
    // console.log(err);
    res.status(404).json({ err: err.message });
  }
};

const softDelete = async (req, res) => {
  try {
    //find post using title
    const { title } = req.params;

    const post = await PostService.findOne(title);
    if (!post.active || !post) {
      return res.status(400).json({ message: "This post does not exist" });
    }

    //check for user id from logged in cookie
    const authorId = req.user.id;

    const postId = post.userId;

    //check if its the owner of the post trying to delete the post by comparing ids
    if (authorId != postId) {
      return res
        .status(400)
        .json({ message: "You are not authorized to delete this post" });
    }

    //soft delete function by switching active status
    const postData = {
      active: false,
    };
    await PostService.update(title, postData);

    return res
      .status(200)
      .json({ message: "The post has been deleted successfully" });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    //state nessary parameters
    const title = req.params.title;
    const { description, tags } = req.body;
    const file = req.file.path;
    const upload = await cloudinary.v2.uploader.upload(file);

    const userId = req.user.id;

    //find post using title
    const post = await PostService.findOne(title);

    //check if post exists
    const postId = post.id;
    if (!post.active || !post) {
      return res.status(400).json({ message: "This post does not exist" });
    }

    const authorId = post.userId;

    //check if the owner is the one trying to update the post by comparing ids
    if (userId != authorId) {
      return res.status(400).json({ message: "You cant update this post" });
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
module.exports = {
  getAllPosts,
  getPosts,
  createPost,
  softDelete,
  updatePost,
};
