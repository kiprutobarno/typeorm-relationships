import App from "./app";
import PostsController from "./posts/posts.controller";
import AuthenticationController from "./authentication/authentication.controller";
import UserController from "./users/users.controller";
import ReportController from "./report/report.controller";

const app = new App([
  new PostsController(),
  new AuthenticationController(),
  new UserController(),
  new ReportController()
]);

app.listen();
