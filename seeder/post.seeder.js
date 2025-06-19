const PostService = require("../services/post.service");

const postSeeder = async () => {
  try {
    for (let i = 1; i < 50; i++) {
      const data = {
        userId: 59,
        title: `Post ${i}`,
        description: `This is post ${i}`,
        tags: `RANDOM`,
        picture: `https://localhost:1234/randomshit`,
      };
      // console.log(data);
      await PostService.create({ data: data });
    }
    await PostService.disconnect();
  } catch (err) {
    console.log(err);
  }
};

postSeeder();
