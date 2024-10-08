import express from "express";
import protect from "../middleware/protect.js";
import {
  fileDelete,
  fileRead,
  fileUpload,
} from "../controller/fileUploadController.js";

const FileUploadRouter = express.Router();

FileUploadRouter.post("/file/upload", protect, fileUpload);
FileUploadRouter.get("/file/read", protect, fileRead);
FileUploadRouter.delete("/file/delete/:id", protect, fileDelete);

export default FileUploadRouter;
