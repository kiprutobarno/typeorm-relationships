import express, { Application } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { config } from "./Utils/config";
import Controller from "./interfaces/controller.interface";

class App {
  public app: Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.dbConnection();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
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
