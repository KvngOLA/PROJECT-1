const { PrismaClient } = require("@prisma/client");
const PostService = require("../services/post.service");
const CommentService = require("../services/comment.service");
const prisma = new PrismaClient();

const getComments = async (req, res) => {
  try {
    const title = req.params.title;
    //find post using title;
    const post = await PostService.findOne(title);

    //check is post exists
    if (!post || !post.active) {
      return res.status(400).json({ message: "This post does not exist" });
    }
    const postId = post.id;

    //pagination
    const pageSize = req.query.limit || 10;
    const page = Number(req.query.page) || 1;
    const count = await CommentService.count(postId);

    const comments = await CommentService.findMany(postId, pageSize, page);

    //if there are no comments
    if (comments.length === 0) {
      return res.status(400).json({ message: "This post has no comments" });
    }

    return res.status(200).json({
      result: comments,
      page: page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    //find a particular comment by id
    const id = req.params.id;
    const intId = parseFloat(id);

    const comment = await CommentService.findOne(intId);

    //check if such a comment exists
    if (!comment || !comment.active) {
      return res.status(400).json({ message: "No such comment exists" });
    }

    const postId = comment.postId;
    const post = await PostService.findbyId(postId);

    const postTitle = post.title;

    return res.status(200).json({
      message: `Comment ${id} of post ${postTitle}`,
      result: comment,
    });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const createComment = async (req, res) => {
  try {
    //state params
    const title = req.params.title;
    const comment = req.body.comment;

    //check comment
    if (!comment) {
      return res.status(400).json({ message: "Please type in your comment" });
    }

    //find post to comment on
    const post = await PostService.findOne(title);

    //check is the post exists
    if (!post || !post.active) {
      return res.status(400).json({ message: "This post does not exist" });
    }

    const authorId = req.user.id;
    const postId = post.id;

    //create new comment

    const data = {
      userId: authorId,
      postId: postId,
      comment: comment,
    };

    const createComment = await CommentService.create(data);

    return res.status(200).json({ result: createComment });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const softDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const intId = parseFloat(id);

    //find comment
    const author = await CommentService.findOne(intId);

    //check if commnet exists
    if (!author || !author.active) {
      return res.status(400).json({ message: "This post does not exist" });
    }

    const userId = req.user.id;
    const authorId = author.userId;

    //check if its the owner of the comment trying to delete it
    if (userId != authorId) {
      return res
        .status(409)
        .json({ message: "You are not authorized to delete this comment " });
    }

    //delete comment

    const data = {
      active: false,
    };
    const deleteComment = await CommentService.update(intId, data);

    return res
      .status(200)
      .json({ message: "The comment has been deleted successfully" });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const updatedComments = async (req, res) => {
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

    const userId = req.user.id;
    const authorId = author.userId;

    //check if its the owner of the comment trying to update it
    if (userId != authorId) {
      return res
        .status(409)
        .json({ message: "You are not authorized to update this comment" });
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

module.exports = {
  getComments,
  createComment,
  softDelete,
  updatedComments,
  getCommentById,
};
