const nodeCron = require("node-cron");
const emitter = require("../mailer/mailer");
const UserService = require("../services/user.service");

const remindInactiveUsers = () => {
  // console.log("Reminder Schedule Started");
  nodeCron.schedule(" 0 8 * * *", async () => {
    try {
      const inactiveUsers = await UserService.findUnverifiedUsers();
      await Promise.all(
        inactiveUsers.map(async (user) => {
          const options = {
            email: user.email,
            subject: "Account activation",
            message: `Hello ${user.name}, your account has not been verified, Please verify your account with the otp sent to you`,
          };

          emitter.emit("send-mail", options);
        })
      );
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = remindInactiveUsers;
