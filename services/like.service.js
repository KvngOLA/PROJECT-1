const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class LikeService {
  static async findMany(postId) {
    return prisma.likes.findMany({
      where: {
        postId: postId,
      },
    });
  }
  static async findOne(userId, postId) {
    return prisma.likes.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });
  }
  static async delete(userId, postId) {
    return prisma.likes.delete({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });
  }
  static async hardDeleteMany(userId) {
    return prisma.likes.deleteMany({
      where: {
        userId: userId,
      },
    });
  }
  static async create(data) {
    return prisma.likes.create({
      data: data,
    });
  }
}

module.exports = LikeService;
