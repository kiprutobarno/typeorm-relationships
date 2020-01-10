import { Router, Response, Request, NextFunction } from "express";
import Post from "./post.interface";
import postModel from "./posts.model";
import HttpException from "../exceptions/HttpException";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import authMiddleware from "../middleware/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import userModel from "../users/user.models";
import { V1_BASE_URL } from "../Utils/constants";

class PostsController {
  public path = `${V1_BASE_URL}/posts`;
  public router = Router();
  private post = postModel;
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPost);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreatePostDto),
        this.createPost
      )
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.updatePost
      )
      .delete(`${this.path}/:id`, this.deletePost);
  }

  getAllPosts = async (_req: Request, res: Response, next: NextFunction) => {
    let feedback = await this.post.find();
    if (feedback) {
      res
        .status(200)
        .send({ status: 200, message: "Success", posts: feedback });
    } else {
      next(new HttpException(404, "Post not found"));
    }
  };

  createPost = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const data: CreatePostDto = req.body;
    const createdPost = new this.post({ ...data, authors: [req.user._id] });
    const user = await this.user.findById(req.user._id);
    user["posts"] = [...user["posts"], createdPost._id];
    await user.save();
    const feedback = await createdPost.save();
    //replace author id with actual author data using execPopulate() function
    await feedback.populate("authors", "-password").execPopulate();
    if (feedback) {
      res.status(201).send({ status: 201, message: "Created", post: feedback });
    } else {
      next(new HttpException(404, "An error ocurred"));
    }
  };

  getPost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const feedback = await postModel.findById(id);
    if (feedback) {
      res.status(200).send({ status: 200, message: "Success", post: feedback });
    } else {
      next(new PostNotFoundException(id));
    }
  };

  updatePost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data: Post = req.body;
    const feedback = await this.post.findByIdAndUpdate(id, data, { new: true });
    if (feedback) {
      res.status(200).send({ status: 200, message: "Success", post: feedback });
    } else {
      next(new PostNotFoundException(id));
    }
  };

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const feedback = await this.post.findByIdAndDelete(id);
    if (feedback) {
      res.status(200).send("Deleted");
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default PostsController;
