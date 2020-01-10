import { model, Document, Schema } from "mongoose";
import Post from "./post.interface";

const postSchema = new Schema({
  authorId: String,
  content: String,
  title: String
});

const postModel = model<Post & Document>("Post", postSchema);

export default postModel;
