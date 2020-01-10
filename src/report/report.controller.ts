import Controller from "../interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import userModel from "../users/user.models";
import { V1_BASE_URL } from "../Utils/constants";

class ReportController implements Controller {
  public path = `${V1_BASE_URL}/report`;
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
        $match: {
          "address.country": {
            //$exist set to true will show users only with country property
            $exists: true
          }
        }
      },
      {
        $group: {
          _id: {
            country: "$address.country"
          },
          users: {
            // $push returns an array of values that were grouped, users in this case
            $push: {
              name: "$name",
              id: "$_id"
            }
          },
          //$count users per country starting from 1
          count: {
            $sum: 1
          }
        }
      },

      {
        //$sort allows sorting all documents based on specified numerical fields
        // sort: 1 for ascending order or sort: -1 for descendng order
        $sort: {
          count: -1
        }
      },

      //$lookup stage performs a join. It attaches other documents to existing ones based on a field
      {
        $lookup: {
          from: "posts",
          localField: "users._id",
          foreignField: "author",
          as: "articles"
        }
      },
      {
        //$addField stage to sort by the country in which users wrote the most amount of articles
        // $size operator, we can add a field that holds the length of the articles array:
        $addFields: {
          amountOfArticles: {
            $size: "$articles"
          }
        }
      },
      {
        $sort: {
          amountOfArticles: -1
        }
      }

      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "users._id",
      //     foreignField: "users._id",
      //     as: "users"
      //   }
      // }
    ]);
    res.status(200).send({ usersByCountry });
  };
}
export default ReportController;
