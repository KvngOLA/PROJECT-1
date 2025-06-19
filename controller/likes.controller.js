const PostService = require("../services/post.service");
const LikeService = require("../services/like.service");


const getLikeStatus = async (req, res) => {
  try {
    const { title } = req.params;
    const userId = req.user.id;

    //find post using title
    const post = await PostService.findOne(title);

    //check if post exists
    if (!post || !post.active) {
      return res.status(400).json({ message: "No such post exists" });
    }

    const postId = post.id;

    //find all likes
    const totalLikes = await LikeService.findMany(postId);

    //return only total number of likes
    return res
      .status(200)
      .json({ message: `This post has ${totalLikes.length} likes` });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

//toggle button
const likePost = async (req, res) => {
  try {
    const { title } = req.params;

    //find post using title
    const post = await PostService.findOne(title);

    if (!post && !post.active) {
      return res.status(400).json({ message: "This post does not exist" });
    }

    const userId = req.user.id;
    const postId = post.id;

    //find if you have liked the post before if yes it deletes it {as a dislike} if no then likes it
    const likedPost = await LikeService.findOne(userId, postId);

    //if already liked { then dislike}
    if (likedPost) {
      await LikeService.delete(userId, postId);
      return res.status(200).json({ message: "Post unliked successfully" });

      //if not liked {then like}
    } else {
      const data = {
        userId,
        postId,
      };

      await LikeService.create(data);

      return res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

module.exports = {
  getLikeStatus,
  likePost,
};
