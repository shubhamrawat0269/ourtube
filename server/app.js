import express from "express";
import fileUpload from "express-fileupload";
const app = express();

import userRoutes from "./routes/user.route.js";

// Middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

export default app;