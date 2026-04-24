import mongoose from "mongoose";
import commentSchema from "../schema/comment.schema.js";

const Comments = mongoose.model("Comment", commentSchema);

export default Comments;
