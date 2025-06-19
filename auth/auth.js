const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  try {
    const actualToken = req.cookies.token;
    if (!actualToken) {
      return res.status(400).json({ message: "Please sign in" });
    }
    const validToken = jwt.verify(actualToken, process.env.JWT_SECRET);
    if (!validToken) {
      return res.status(400).json({ message: "Please input valid Token" });
    }
    req.user = validToken;
    next();
  } catch (err) {
    // console.log(err);
    res.status(400).json({ err: err.message });
  }
};

module.exports = verifyUser;
