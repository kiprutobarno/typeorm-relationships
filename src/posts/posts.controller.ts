import { Router, Response, Request } from "express";
import Post from "./post.interface";
import postModel from "./posts.model";

class PostsController {
  public path = "/posts";
  public router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createPost);
    this.router.get(`${this.path}/:id`, this.getPost);
    this.router.patch(`${this.path}/:id`, this.updatePost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  getAllPosts = async (req: Request, res: Response) => {
    let posts = await this.post.find();
    res.status(200).send({ posts: posts });
  };

  createPost = async (req: Request, res: Response) => {
    const data: Post = req.body;
    const createdPost = new postModel(data);
    const created = await createdPost.save();
    res.status(201).send({ post: created });
  };

  getPost = async (req: Request, res: Response) => {
    const id = req.params.id;
    const post = await postModel.findById(id);
    res.status(200).send({ post: post });
  };

  updatePost = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data: Post = req.body;
    const post = await this.post.findByIdAndUpdate(id, data, { new: true });
    res.status(200).send({ post: post });
  };

  deletePost = async (req: Request, res: Response) => {
    const id = req.params.id;
    const feedback = await this.post.findByIdAndDelete(id);
    if (feedback) {
      res.status(200).send("Deleted");
    } else {
      res.status(404).send("Error");
    }
  };
}

export default PostsController;
