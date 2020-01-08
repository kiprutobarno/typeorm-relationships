import { Router, Response, Request } from "express";
import Post from "./post.interface";

class PostsController {
  public path = "/posts";
  public router = Router();

  private posts: Post[] = [
    { author: "Kipruto Barno", content: "Hello world", title: "Greetings" }
  ];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createPost);
  }

  getAllPosts = (_req: Request, res: Response) => {
    res.send(this.posts);
  };

  createPost = (req: Request, res: Response) => {
    const post: Post = req.body;
    this.posts.push(post);
    res.send(post);
  };
}

export default PostsController;
