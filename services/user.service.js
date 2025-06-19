const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserService {
  static async count() {
    return prisma.users.count({
      where: {
        role: {
          in: ["admin", "user"],
        },
      },
    });
  }
  static async findOne(email) {
    return prisma.users.findUnique({
      where: { email },
    });
  }
  static async findByName(name) {
    return prisma.users.findFirst({
      where: { name: name },
    });
  }
  static async findMany(pageSize, page) {
    return prisma.users.findMany({
      where: {
        id: {
          gte: 1,
        },
        role: {
          in: ["admin", "user"],
        },
      },
      skip: pageSize * (page - 1),
      take: pageSize,
    });
  }
  static async create(data) {
    return prisma.users.create(data);
  }
  static async update(email, data) {
    return prisma.users.update({
      where: {
        email: email,
      },
      data: data,
    });
  }
  static async disconnect() {
    return prisma.$disconnect();
  }
  static async hardDelete(name) {
    return prisma.users.deleteMany({
      where: {
        name: name,
      },
    });
  }
  static async findUnverifiedUsers() {
    return prisma.users.findMany({
      where: {
        isVerified: false,
      },
    });
  }
  static async findExpiredUsers(expiry) {
    return prisma.users.findMany({
      where: {
        isVerified: false, // The task was not completed
        createdAt: { lt: expiry }, // User created 3 days ago or more
      },
    });
  }
  static async deleteExpiredUsers(userId) {
    return prisma.users.delete({ where: { id: userId } });
  }
}

module.exports = UserService;
