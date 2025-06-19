const CommentService = require("../services/comment.service");

const commentSeeder = async () => {
  try {
    for (let i = 1; i < 50; i++) {
      const data = {
        userId: 59,
        postId: 2,
        comment: `Comment ${i}`,
      };
      // console.log(data);
      await CommentService.create(data);
    }
    await CommentService.disconnect();
  } catch (err) {
    console.log(err);
  }
};

commentSeeder();
