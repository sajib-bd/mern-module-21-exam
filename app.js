import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongodbSanitize from "mongodb-sanitize";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connect from "./config/connect.js";
import { UserRouter } from "./router/userRouter.js";
import FileUploadRouter from "./router/fileUploadRouter.js";

dotenv.config();
const app = express();

const limit = rateLimit({
  windowMs: process.env.REQ_MS,
  max: process.env.REQ_LIMIT,
  message: "Too many requests, please try again later.",
  statusCode: 429,
});

app.use(limit);
app.use(cors());
app.use(cookieParser());
app.use(mongodbSanitize());
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable("x-powered-by");
app.set("etag", true);

const PORT = process.env.PORT || 4000;

app.use("/api/v1", UserRouter, FileUploadRouter);

//image file get access
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/file", express.static(path.join(__dirname, "file")));

app.listen(PORT, () => {
  connect();
  console.log(`Server Running ${PORT}`);
});
