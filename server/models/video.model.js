import mongoose from "mongoose";
import videoSchema from "../schema/video.schema.js";

const Video = mongoose.model("Video", videoSchema);

export default Video;
