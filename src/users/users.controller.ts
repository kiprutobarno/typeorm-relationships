import Controller from "../interfaces/controller.interface";
import { Router, NextFunction, Response, Request } from "express";
import postModel from "../posts/posts.model";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import authMiddleware from "../middleware/auth.middleware";
import { V2_BASE_URL } from "../Utils/constants";
import User from "../entity/user";
import { getRepository } from "typeorm";

class UserController implements Controller {
  public path = `${V2_BASE_URL}/users`;
  public router = Router();
  private userRepository = getRepository(User);
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    // this.router.get(
    //   `${this.path}/:id/posts`,
    //   authMiddleware,
    //   this.getUserPosts
    // );
    this.router.get(this.path, authMiddleware, this.getUsers);
    this.router.get(`${this.path}/:id`, authMiddleware, this.getUser);
  }

  getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const feedback = await this.userRepository.find();
      res.status(200).send({ users: feedback });
    } catch (error) {
      next(new NotAuthorizedException());
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const feedback = await this.userRepository.findOne(id);
      res.status(200).send({ user: feedback });
    } catch (error) {
      next(new NotAuthorizedException());
    }
  };

  //   getUserPosts = async (
  //     req: RequestWithUser,
  //     res: Response,
  //     next: NextFunction
  //   ) => {
  //     const userId = req.params.id;
  //     if (userId === req.user._id.toString()) {
  //       const feedback = await this.post.find({ author: userId });
  //       res.status(200).send({ posts: feedback });
  //     } else {
  //       next(new NotAuthorizedException());
  //     }
  //   };
}

export default UserController;
