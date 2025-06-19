const nodeCron = require("node-cron");
const UserService = require("../services/user.service");
const FollowService = require("../services/follow.service");
const LikeService = require("../services/like.service");
const CommentService = require("../services/comment.service");
const PostService = require("../services/post.service");

const deleteInactiveUsers = () => {
  nodeCron.schedule("0 0 * * *", async () => {
    try {
      const today = new Date().getDate();
      if (today % 3 !== 0) {
        return; // Skip unless today is a 3rd day
      }

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const inactiveUsers = await UserService.findExpiredUsers(threeDaysAgo);

      const result = await Promise.all(
        inactiveUsers.map(async (user) => {
          const userId = user.id;
          //check for posts, comments, likes, following associated to the user and delete

          //for following
          await FollowService.hardDeleteMany(userId);

          //for likes
          await LikeService.hardDeleteMany(userId);

          //for comments
          await CommentService.hardDeleteMany(userId);

          //for posts
          await PostService.hardDeleteMany(userId);

          //for user
          await UserService.deleteExpiredUsers(userId);
          console.log(`User ${user.email} deleted due to inactivity.`);
        })
      );
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = deleteInactiveUsers;
