const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class PostService {
  static async count() {
    return prisma.post.count({
      where: {
        active: true,
      },
    });
  }
  static async findMany(pageSize, page) {
    return prisma.post.findMany({
      where: {
        userId: {
          gte: 1,
        },
        active: true,
      },
      skip: pageSize * (page - 1),
      take: pageSize,
    });
  }
  static async findOne(title) {
    return prisma.post.findUnique({
      where: {
        title: title,
      },
    });
  }
  static async findbyId(id) {
    return prisma.post.findUnique({
      where: {
        id: id,
      },
    });
  }
  static async findByUserId(userId) {
    return prisma.post.findMany({
      where: {
        userId: userId,
      },
    });
  }
  static async create(data) {
    return prisma.post.create(data);
  }
  static async update(title, data) {
    return prisma.post.update({
      where: {
        title: title,
      },
      data: data,
    });
  }
  static async hardDelete(title) {
    return prisma.post.delete({
      where: {
        title: title,
      },
    });
  }
  static async hardDeleteMany(userId) {
    return prisma.post.deleteMany({
      where: {
        userId: userId,
      },
    });
  }
  static async disconnect() {
    return prisma.$disconnect();
  }
}

module.exports = PostService;
