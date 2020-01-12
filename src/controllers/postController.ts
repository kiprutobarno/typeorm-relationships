import { Router, Response, Request, NextFunction } from "express";
import { getRepository } from "typeorm";
import Post from "../entity/posts";
import HttpException from "../exceptions/HttpException";
import validationMiddleware from "../middleware/valdationMiddleware";
import CreatePostDto from "../dtos/postDto";
import { V2_BASE_URL } from "../Utils/constants";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import authMiddleware from "../middleware/authMiddleware";
import RequestWithUser from "../interfaces/requestWithUserInterface";

class PostsController {
  public path = `${V2_BASE_URL}/posts`;
  public router = Router();
  private postRepository = getRepository(Post);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(CreatePostDto),
      this.createPost
    );
    this.router.get(this.path, this.getPosts);
    this.router.get(`${this.path}/:id`, this.getPost);
    this.router.patch(
      `${this.path}/:id`,
      authMiddleware,
      validationMiddleware(CreatePostDto, true),
      this.updatePost
    );
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  createPost = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const data: CreatePostDto = req.body;
    const post = this.postRepository.create({
      ...data,
      author: req.user
    });
    const feedback = await this.postRepository.save(post);
    if (feedback) {
      res.status(201).send({ status: 201, message: "Created", post: feedback });
    } else {
      next(new HttpException(404, "An error ocurred"));
    }
  };

  getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const feedback = await this.postRepository.find({
      relations: ["categories"]
    });
    if (feedback) {
      res
        .status(200)
        .send({ status: 200, message: "Success", posts: feedback });
    } else {
      next(new HttpException(404, "An error ocurred"));
    }
  };

  getPost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const feedback = await this.postRepository.findOne(id, {
      relations: ["categories"]
    });
    if (feedback) {
      res.status(200).send({ status: 200, message: "Success", post: feedback });
    } else {
      next(new PostNotFoundException(id));
    }
  };

  updatePost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data: Post = req.body;
    await this.postRepository.update(id, data);
    const feedback = await this.postRepository.findOne(id);
    if (feedback) {
      res.status(200).send({ status: 200, message: "Success", post: feedback });
    } else {
      next(new PostNotFoundException(id));
    }
  };

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const feedback = await this.postRepository.delete(id);
    if (feedback.raw[1]) {
      res.status(200).send({ status: 200, message: "Success", post: feedback });
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default PostsController;
