import { model, Document, Schema } from "mongoose";
import Post from "./post.interface";

const postSchema = new Schema({
  authors: {
    ref: "User",
    type: Schema.Types.ObjectId
  },
  content: String,
  title: String
});

const postModel = model<Post & Document>("Post", postSchema);

export default postModel;
