const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const userRouter = require("./router/user.routes");
const postRouter = require("./router/post.routes");
const commentRouter = require("./router/comments.routes");
const likesRouter = require("./router/likes.routes");
const followRouter = require("./router/follow.routes");
const adminRouter = require("./router/admin.routes");
const superAdminRouter = require("./router/superAdmin.routes");
const app = express();
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const remindInactiveUsers = require("./scheduler/reminder");
const deleteInactiveUsers = require("./scheduler/scheduler");
const deleteExpiredOtps = require("./scheduler/otpreminder");

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft- 7",
  legacyHeaders: false,
});
app.use(limiter);
app.use(helmet());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/like", likesRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/superAdmin", superAdminRouter);

remindInactiveUsers();
deleteInactiveUsers();
deleteExpiredOtps();

app.all("*", (req, res) => {
  return res.status(404).json({
    error: `The resource with the url ::: ${req.originalUrl} does not exist`,
  });
});

app.listen(port, () => console.log(`Listening for requests in port ${port}`));
