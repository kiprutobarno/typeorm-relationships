import App from "./app";
import PostsController from "./posts/posts.controller";
import AuthenticationController from "./authentication/authentication.controller";
import UserController from "./users/users.controller";

const app = new App([
  new PostsController(),
  new AuthenticationController(),
  new UserController()
]);

app.listen();
