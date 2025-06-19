const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class FollowService {
  static async findFollowers(followeeId) {
    return prisma.follow.findMany({
      where: { followeeId: followeeId },
    });
  }
  static async findFollowing(followerId) {
    return prisma.follow.findMany({
      where: { followerId: followerId },
    });
  }
  static async findOne(followeeId, followerId) {
    return prisma.follow.findUnique({
      where: {
        followeeId_followerId: {
          followeeId: followeeId,
          followerId: followerId,
        },
      },
    });
  }
  static async delete(followeeId, followerId) {
    return prisma.follow.delete({
      where: {
        followeeId_followerId: {
          followeeId: followeeId,
          followerId: followerId,
        },
      },
    });
  }
  static async create(data) {
    return prisma.follow.create({ data: data });
  }
  static async hardDeleteMany(followerId) {
    return prisma.follow.deleteMany({
      where: {
        followerId: followerId,
      },
    });
  }
}

module.exports = FollowService;
