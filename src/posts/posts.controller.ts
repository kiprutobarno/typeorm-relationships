import { Router, Response, Request, NextFunction } from "express";
import { getRepository } from "typeorm";
import Post from "../entities/posts";
import HttpException from "../exceptions/HttpException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import { V2_BASE_URL } from "../Utils/constants";

class PostsController {
  public path = `${V2_BASE_URL}/posts`;
  public router = Router();
  private postResitory = getRepository(Post);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDto),
      this.createPost
    );
  }

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    const data: CreatePostDto = req.body;
    const post = this.postResitory.create(data);
    const feedback = await this.postResitory.save(post);
    if (feedback) {
      res.status(201).send({ status: 201, message: "Created", post: feedback });
    } else {
      next(new HttpException(404, "An error ocurred"));
    }
  };
}

export default PostsController;
