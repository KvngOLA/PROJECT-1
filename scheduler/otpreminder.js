const nodeCron = require("node-cron");
const OtpService = require("../services/otp.service");

const deleteExpiredOtps = () => {
  nodeCron.schedule("0 * * * *", async () => {
    try {
      const result = await OtpService.deleteExpiredOtp();

      if (result.count > 0) {
        console.log(`✅ ${result.count} expired OTP(s) cleaned up.`);
      }
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = deleteExpiredOtps;
