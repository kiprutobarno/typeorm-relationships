import Controller from "../interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import userModel from "../users/user.models";

class ReportController implements Controller {
  public path = "/report";
  public router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.generateReport);
  }

  private generateReport = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const usersByCountry = await this.user.aggregate([
      {
        $group: {
          _id: {
            country: "$address.country"
          }
        }
      }
    ]);
    res.status(200).send({ usersByCountry });
  };
}
export default ReportController;
