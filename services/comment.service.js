const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CommentService {
  static async countAll() {
    return prisma.comment.count({
      where: {
        active: true,
      },
    });
  }
  static async count(postId) {
    return prisma.comment.count({
      where: {
        postId: postId,
        active: true,
      },
    });
  }
  static findMany(postId, pageSize, page) {
    return prisma.comment.findMany({
      where: {
        postId: postId,
        active: true,
      },
      skip: pageSize * (page - 1),
      take: pageSize,
    });
  }
  static async findOne(id) {
    return prisma.comment.findUnique({
      where: {
        id: id,
      },
    });
  }
  static async findByUserId(userId) {
    return prisma.comment.findUnique({
      where: {
        userId: userId,
      },
    });
  }
  static async create(data) {
    return prisma.comment.create({
      data: data,
    });
  }
  static async update(id, data) {
    return prisma.comment.update({
      where: {
        id: id,
      },
      data: data,
    });
  }
  static async hardDelete(id) {
    return prisma.comment.delete({
      where: {
        id: id,
      },
    });
  }
  static async findAll(pageSize, page) {
    return prisma.comment.findMany({
      where: {
        id: {
          gte: 1,
        },
      },
      skip: pageSize * (page - 1),
      take: pageSize,
    });
  }
  static async hardDeleteMany(userId) {
    return prisma.comment.deleteMany({
      where: {
        userId: userId,
      },
    });
  }
  static async disconnect() {
    return prisma.$disconnect();
  }
}

module.exports = CommentService;
