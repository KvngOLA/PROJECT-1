const FollowService = require("../services/follow.service");
const UserService = require("../services/user.service");

//get total number of followers
const getFollowersStatus = async (req, res) => {
  try {
    //find user using id
    const followeeId = req.user.id;

    //find all users that are following the logged in user
    const followers = await FollowService.findFollowers(followeeId);

    //return the total number of users following the logged in user only
    return res
      .status(200)
      .json({ message: `You have ${followers.length} followers` });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const getFollowingStatus = async (req, res) => {
  try {
    //get logged in user using id

    const followingId = req.user.id;

    //find all users that the loggged in user is following
    const totalFollowing = await FollowService.findFollowing(followingId);

    //return only total number of users that the logged in user is following
    return res
      .status(200)
      .json({ message: `You are following ${totalFollowing.length} users` });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

//to follow a user
//toggle button
const follow = async (req, res) => {
  try {
    //state params
    const followeeName = req.params.name;

    const followee = await UserService.findByName(followeeName);
    if (!followee) {
      return res.status(404).json({ message: "This user deos not exist" });
    }

    const followeeId = followee.id;
    const followerId = req.user.id;

    //check if user is tryin to follow himself
    if (followeeId == followerId) {
      return res.status(401).json({ message: "You cannot follow yourself" });
    }

    //check if following or not
    const following = await FollowService.findOne(followeeId, followerId);

    //unfollow
    if (following) {
      await FollowService.delete(followeeId, followerId);
      return res
        .status(200)
        .json({ message: `You have unfollowed ${followeeName} successfully` });

      //follow
    } else {
      const data = {
        followeeId: followeeId,
        followerId: followerId,
      };

      await FollowService.create(data);
      return res
        .status(200)
        .json({ message: `You have followed ${followeeName} successfully` });
    }
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

module.exports = {
  getFollowersStatus,
  getFollowingStatus,
  follow,
};
