# Project Name: LinkedIn Learning

Categories in Project

- Users
- Admins
- Super Admins

#### Tech Stack

- Nodejs
- Express
- MySQL
- ORM: Prisma or TypeORM

#### Features

- User can do the following:
  Authentication: - Signup: Email, Password, Name, Phone, Profile Picture(using Multer and Cloudinary: Optional), Address ✅ - Validate Password Strength and Complexity (1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number)✅ - Validate Email using Joi ✅ - Send Email and Use OTP for Email Verification✅ => figure out how to send it to actual mails✅ - OTP: 6 Digit Number and expires in 5 minutes ✅-- still on the minute timer✅ - Forgot Password: Email and get reset password✅ - Reset Password: Email, Password, Confirm Password✅ - Login: Email, Password - JWT Token: Expires in 1 hour✅

Profile: - Update Profile: Name, Profile Picture✅ - Get Profile: Name, Phone, Email, Profile Picture✅ - Delete Profile: Soft Delete✅

Posts: - Create Post: Title, Description, Image, Tags

- Update Post: Title, Description, Image, Tags ✅
- Get Post: Title, Description, Image, Tags ✅
- Delete Post: Soft Delete✅

Comments: - Create Comment: PostId, Comment, UserId(Logged In User)✅ - Update Comment: Comment✅ - Get Comment: Comment - Delete Comment: Soft Delete✅

Likes: - Like Post: PostId, UserId(Logged In User) - Unlike Post: PostId, UserId(Logged In User) - This will like a toggle button✅

Followers: - Follow User: UserId, FollowerId - Unfollow User: UserId, FollowerId✅

- Admin can do the following:

  - Seed admin user information on bootstrapping (boot strapping) - One time setup✅
  - Authenticate: Email, Password✅

- Admin Privileges:✅

  - Can delete any post✅
  - Can delete any comment✅
  - Can delete any user✅
  - Can update any post✅
  - Can update any comment✅

- Admin stats:✅

  - Add pagination to all the endpoints✅
  - Total Users and Count✅
  - Total Posts and Count✅
  - Total Comments and Count✅

- Super Admin can do the following:✅

  - Seed super admin user information on bootstrapping (boot strapping) - One time setup✅
  - Authenticate: Email, Password✅
  - Confirm their otp on login✅

- Super Admin Privileges:✅
  - can delete Admin and User (soft delete)✅
  - And on deleting admin, all the posts, comments, likes, followers should be deleted that is associated with that admin or user✅

### Relationships✅

- User has many Posts (One User to Many Posts)
- Post has many Comments (One Post to Many Comments)
- Post has many Likes (One Post to Many Likes)
- User has many Followers (One User to Many Followers)
- User has many Following (One User to Many Following) etc.

#### Unit Testing

- Write unit tests for all the services e.g mocha/chai or jest

#### Deployment

- Push the code to GitHub
- Deploy the code to Heroku or Render
