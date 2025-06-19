const bcrypt = require("bcrypt");
const UserService = require("../services/user.service");

const adminSeeder = async () => {
  try {
    for (let i = 1; i < 4; i++) {
      const data = {
        name: `admin${i}`,
        email: `admin${i}@yopmail.com`,
        password: await bcrypt.hash(`password${i}`, 10),
        phone: `0807${i + 1}09218${i}`,
        address: `Plot 10 Block 1${i}, DEV site IV, Tourna Estension, Abuja`,
        profile_picture:
          "https://res.cloudinary.com/drlkms4ra/image/upload/v1745028033/zxszq6egqq4xt84qfnj8.png",
        role: "admin",
        isVerified: true,
      };
      // console.log(data);
      const users = await UserService.create({ data: data });
    }
    await UserService.disconnect();
  } catch (err) {
    console.log(err);
  }
};

adminSeeder();
