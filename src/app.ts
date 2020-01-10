import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import mongoose from "mongoose";
import { config } from "./Utils/config";
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";

class App {
  public app: Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.dbConnection();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    // this.app.use(cookieParser());
    // this.app.use(cookie())
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.map(controller => {
      this.app.use("/", controller.router);
    });
  }

  private dbConnection() {
    mongoose.connect(config.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  public listen() {
    this.app.listen(config.PORT, () => {
      console.log(`App listening on the port ${config.PORT}`);
    });
  }
}

export default App;
