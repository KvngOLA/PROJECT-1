const cloudinary = require("../cloudinary/cloudinary");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const generateOtp = require("../otp/otp");
const generateJwt = require("../utils/generateToken");
const emitter = require("../mailer/mailer");
const UserService = require("../services/user.service");
const OtpService = require("../services/otp.service");

//home page
const homePage = (req, res) => {
  res.send("Hello Welcome to Ola's first major project");
};

//user signup validated using joi
const userSignUp = async (req, res) => {
  try {
    //things to input on signup
    const {
      name,
      email,
      password,
      phone,
      address,
      isVerified,
      confirm_password,
      role,
    } = req.body;

    const file = req.file.path;
    const upload = await cloudinary.v2.uploader.upload(file);

    //find if the user already exists, if not proceeds

    const userExists = await UserService.findOne(email);

    if (userExists) {
      return res.status(409).json({ message: "This user already exists" });
    }

    //confirm is password is correct

    if (password !== confirm_password) {
      return res
        .status(400)
        .json({ message: "Please repeat correct password" });
    }
    const userData = {
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        phone,
        profile_picture: upload.secure_url,
        address,
        isVerified,
        role,
      },
    };

    //joi to ensure the users input is follow certain rules

    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(
          new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,30}$'
          )
        )
        .required(),
      confirm_password: Joi.ref("password"),
      phone: Joi.string().length(11),
      address: Joi.string().required(),
      role: Joi.string(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.message });
    }

    //generate otp after signup and store in cookie
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    //check otp
    const checkOtp = OtpService.findOne(email);
    if (checkOtp) {
      await OtpService.deleteMany(email);
    }

    const otpData = {
      email,
      otp: await bcrypt.hash(otp, 10),
      expiresAt: otpExpiry,
    };

    const newOtp = await OtpService.create({ data: otpData });

    //send otp to user mail -->> currently using yopmail
    const message = {
      email: req.body.email,
      subject: "Please input your OTP to continue signup process",
      message: `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            padding: 20px;
            border: 1px solid #ddd;
        }
        h1 {
            color: #333;
            font-size: 24px;
        }
        p {
            color: #666;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Our Platform!</h1>
        <p>Hello Friend</p>
        <p>Thank you for signing up. Please click the button below to confirm your email address and complete your registration:</p>
        <p> Your OTP is ${otp}</p>
        <p>If you didn’t sign up for this account, please ignore this email.</p>
        <div class="footer">
            <p>© 2024 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `,
    };

    const newUser = await UserService.create(userData);

    emitter.emit("send-mail", message);

    return res.status(200).json({
      message: `Signed up successfully, Welcome ${newUser.name}`,
      message:
        "Please input the otp sent to your mail to complete the verification process",
      user: newUser,
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

//to verify the user and complete his signup

const userVerification = async (req, res) => {
  try {
    //state all the required details to be inputted
    const inputOtp = req.body.otp;

    const userEmail = req.user.email;
    const otpObject = await OtpService.findOne(userEmail);
    if (!otpObject) {
      return res.status(401).json({ message: "Otp expired" });
    }

    const realOtp = otpObject.otp;
    const isValid = await bcrypt.compare(inputOtp, realOtp);

    if (isValid) {
      // console.log("OTP is valid.");

      //update the user to a verified status
      const userData = {
        isVerified: true,
      };

      await UserService.update(userEmail, userData);

      //delete used otp
      await OtpService.deleteMany(userEmail);
    } else {
      return res.status(400).json({ message: "Otp is invalid or has expired" });
    }
    return res.status(200).json({ message: "User verified successfully" });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

//get new otp
const getNewOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const email = req.user.email;

    //generate otp
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    //check otp and delete old user otp
    const checkOtp = OtpService.findOne(email);
    if (checkOtp) {
      await OtpService.deleteMany(email);
    }

    const otpData = {
      email,
      otp: await bcrypt.hash(otp, 10),
      expiresAt: otpExpiry,
    };

    //create new otp in database
    const newOtp = await OtpService.create({ data: otpData });

    //send otp to user mail -->> currently using yopmail for testing
    const message = {
      email: email,
      subject: "Please input your OTP to continue signup process",
      message: `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            padding: 20px;
            border: 1px solid #ddd;
        }
        h1 {
            color: #333;
            font-size: 24px;
        }
        p {
            color: #666;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Our Platform!</h1>
        <p>Hello Friend</p>
        <p>Thank you for signing up. Please click the button below to confirm your email address and complete your registration:</p>
        <p> Your OTP is ${otp}</p>
        <p>If you didn’t sign up for this account, please ignore this email.</p>
        <div class="footer">
            <p>© 2024 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `,
    };

    //send mail
    emitter.emit("send-mail", message);

    return res
      .status(200)
      .json({ message: "Your new Otp has been sent to your mail" });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ err: err.message });
  }
};

//User login
const loginUser = async (req, res) => {
  //state all required data to be inputted
  const { email, password } = req.body;

  //check if the user exists
  try {
    const userExists = await UserService.findOne(email);
    if (!userExists) {
      return res.status(400).json({ message: "This user does not exist" });
    }

    //check is the inputted password is correct
    const validPassword = await bcrypt.compare(password, userExists.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //create and store token in a cookie
    const payload = { id: userExists.id, email: userExists.email };
    const token = generateJwt(payload);

    res.cookie("token", token, { httpOnly: true, secure: false });

    return res.status(200).json({ message: "Logged in successfully", token });
  } catch (err) {
    // console.log(err);
    res.status(404).json({ err: err.message });
  }
};

//GET user profile

const userProfile = async (req, res) => {
  try {
    //get user email from the cookie
    const userEmail = req.user.email;

    //find user
    const user = await UserService.findOne(userEmail);

    //if user is not verified dont show, for soft delete
    if (user.isVerified == false) {
      return res.status(400).json({ message: "This user does not exist" });
    }

    return res.status(200).json({ message: `Welcome ${user.name}`, user });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    //state all important data to be inputted
    const name = req.body.name;
    const file = req.file.path;
    const upload = await cloudinary.v2.uploader.upload(file);

    //get user email from token
    const email = req.user.email;

    //find user
    const user = await UserService.findOne(email);

    //if users in not verified do not proceed >> soft delete
    if (user.isVerified == false) {
      return res.status(400).json({ message: "This user does not exist" });
    }

    const data = {
      name,
      profile_picture: upload.secure_url,
    };

    //update the users details
    const updatedUser = await UserService.update(email, data);

    return res
      .status(200)
      .json({ message: "Updated Successfully", updatedUser });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    //get user email from token
    const userEmail = req.user.email;

    //perform soft delete by converting isVerified to false
    const data = {
      isVerified: false,
    };

    await UserService.update(userEmail, data);

    res.clearCookie("token");

    return res.status(200).json({ message: "The user has been deleted" });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    //state all the necessary details to be inputted
    const email = req.body.email;

    //find if the userExists
    const userExists = await UserService.findOne(email);

    if (!userExists || userExists.isVerified == false) {
      return res.status(401).json({ message: "This user does not exist" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const otpData = {
      email,
      otp: await bcrypt.hash(otp, 10),
      expiresAt: otpExpiry,
    };

    const newOtp = await OtpService.create({ data: otpData });

    //send otp to the user
    const message = {
      email: req.body.email,
      subject: "Please input Otp to proceed to reset your password",
      message: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            color: #007BFF;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Your OTP Code</h2>
        </div>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) is: ${otp}</p>
        <div class="otp">{{otp}}</div>
        <p>This code is valid for 5 minutes. Please do not share it with anyone.</p>
        <p>Thank you!</p>
        <div class="footer">
            <p>&copy; 2024 Your Company Name</p>
        </div>
    </div>
</body>
</html>`,
    };
    emitter.emit("send-mail", message);

    res.status(200).json({
      message:
        "An otp has been sent to your mail please input to proceed to input your password",
    });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    //state all important details to be inputted
    const { email, newPassword, confirmPassword } = req.body;
    const inputOtp = req.body.otp;

    const tokenEmail = req.user.email;

    //find user
    const userExists = await UserService.findOne(email);

    //find if user exists
    if (!userExists) {
      return res.status(401).json({ message: "This user does not exist" });
    }

    //confirm the email
    if (email != tokenEmail) {
      return res
        .status(400)
        .json({ message: "Please enter the correct email " });
    }

    //validate users input using joi
    const schema = Joi.object({
      email: Joi.string(),
      otp: Joi.number(),
      newPassword: Joi.string()
        .pattern(
          new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,30}$'
          )
        )
        .required(),
      confirmPassword: Joi.ref("newPassword"),
    });

    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.message });
    }
    //get otp from model
    const otpReset = await OtpService.findOne(email);

    if (!otpReset) {
      return res.status(401).json({ message: "otp expired" });
    }

    const realOtp = otpReset.otp;

    const isValid = await bcrypt.compare(inputOtp, realOtp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or Expired Otp" });
    }

    //update the password of the user with his input
    const data = {
      password: newPassword,
    };

    await UserService.update(email, data);

    //delete Used Otp
    await OtpService.deleteMany(tokenEmail);

    return res
      .status(200)
      .json({ message: "Password changed successfully", userExists });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

module.exports = {
  homePage,
  userSignUp,
  getNewOtp,
  loginUser,
  userProfile,
  updateProfile,
  deleteProfile,
  userVerification,
  forgotPassword,
  resetPassword,
};
