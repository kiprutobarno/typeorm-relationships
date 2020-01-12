import { createConnection } from "typeorm";
import "reflect-metadata";
import App from "./app";
import PostsController from "./controllers/postController";
import AuthenticationController from "./controllers/authController";
import AddressController from "./controllers/addressController";
import UserController from "./controllers/userController";
import CategoryController from './controllers/categoryController';

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
