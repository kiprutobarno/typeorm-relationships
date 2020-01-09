import { Router, Response, Request, NextFunction } from "express";
import Post from "./post.interface";
import postModel from "./posts.model";
import HttpException from "../exceptions/HttpException";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";

class PostsController {
  public path = "/posts";
  public router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDto),
      this.createPost
    );
    this.router.get(`${this.path}/:id`, this.getPost);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreatePostDto),
      this.updatePost
    );
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    let feedback = await this.post.find();
    if (feedback) {
      res
        .status(200)
        .send({ status: 200, message: "Success", posts: feedback });
    } else {
      next(new HttpException(404, "Post not found"));
    }
  };

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    const data: Post = req.body;
    const post = new postModel(data);
    const feedback = await post.save();
    if (post) {
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
