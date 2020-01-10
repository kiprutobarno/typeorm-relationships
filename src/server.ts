import { createConnection } from "typeorm";
import "reflect-metadata";
import App from "./app";
import PostsController from "./posts/posts.controller";

async function init() {
  try {
    await createConnection();
  } catch (error) {
    console.log("Error while connecting to the database", error);
    return error;
  }
  const app = new App([new PostsController()]);

  app.listen();
}

init();
