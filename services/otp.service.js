const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class OtpService {
  static async findOne(email) {
    return prisma.otp.findFirst({
      where: { email },
    });
  }
  static async create(data) {
    return prisma.otp.create(data);
  }
  static async deleteMany(email) {
    return prisma.otp.deleteMany({
      where: {
        email,
      },
    });
  }
  static async deleteExpiredOtp() {
    return prisma.otp.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}

module.exports = OtpService;
