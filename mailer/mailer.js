const dotenv = require("dotenv");
dotenv.config();
const EventEmitter = require("events");
const { optional } = require("joi");
const emitter = new EventEmitter();

const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const message = {
      from: `${process.env.USER_NAME} <${process.env.USER_MAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.message,
    };
    const info = await transporter.sendMail(message);
    return info;
  } catch (err) {
    console.log(err);
  }
};

emitter.on("send-mail", async (options) => {
  try {
    await sendMail(options);
    console.log("📧 Email sent successfully!");
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
});

module.exports = emitter;
