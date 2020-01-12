import express, { Application } from "express";
import bodyParser from "body-parser";
import { config } from "./Utils/config";
import Controller from "./interfaces/controllerInterface";
import errorMiddleware from "./middleware/errorMiddleware";

class App {
  public app: Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.map(controller => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(config.SERVER_PORT, () => {
      console.log(`App listening on the port ${config.SERVER_PORT}`);
    });
  }
}

export default App;
