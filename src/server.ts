import { createConnection } from "typeorm";
import "reflect-metadata";
import App from "./app";
import PostsController from "./posts/posts.controller";
import AuthenticationController from "./authentication/authentication.controller";
import AddressController from "./addresses/address.controller";
import UserController from "./users/users.controller";
import CategoryController from './categories/category.controller';

async function init() {
  try {
    await createConnection();
  } catch (error) {
    console.log("Error while connecting to the database", error);
    return error;
  }
  const app = new App([
    new PostsController(),
    new AuthenticationController(),
    new AddressController(),
    new UserController(),
    new CategoryController()
  ]);

  app.listen();
  return app;
}

init();
