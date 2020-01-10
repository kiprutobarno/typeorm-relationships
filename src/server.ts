import App from "./app";
import PostsController from "./posts/posts.controller";
import AuthenticationController from "./authentication/authentication.controller";

const app = new App([new PostsController(), new AuthenticationController()]);

app.listen();
