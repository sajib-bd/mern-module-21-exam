import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import FileUpload from "../model/fileUploadModel.js";
import MulterFileUpload from "../utils/multer.js";

// Get the current filename
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module
const __dirname = path.dirname(__filename);

export const fileUpload = async (req, res) => {
  try {
    //Extract the user ID from the request headers
    const { id } = req.headers;

    //Use Multer to handle file upload
    MulterFileUpload().single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File Upload Failed" });
      }

      //file upload success, create a new document
      const update = await FileUpload.create({
        userId: id,
        file: req.file.filename,
      });

      //file upload success message
      res.status(200).json({
        message: "File updated successfully",
        filePath: req.file.filename,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

export const fileRead = async (req, res) => {
  try {
    //Extract the user ID from the request headers
    const { id } = req.headers;
    // Define the base URL for accessing the images
    const baseURL = "http://localhost:4040/file";
    //find user images
    const fileFind = await FileUpload.find({ userId: id });
    //Query the database to find all images uploaded by the user
    const filesWithFullPath = fileFind.map(({ _id, userId, file }) => ({
      _id,
      userId,
      // Construct the full file path using the base URL and the file name
      file: `${baseURL}/${file}`,
    }));

    return res.status(200).json({
      file: filesWithFullPath,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

export const fileDelete = async (req, res) => {
  try {
    //receive parameters file id
    const { id } = req.params;
    //Extract the user ID from the request headers
    const userId = req.headers.id;
    //Find the file in the database using its ID
    const fileFind = await FileUpload.findById(id);
    //file not found in the database
    if (!fileFind) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    //Check if the found file's user ID matches the requester user ID
    if (String(fileFind.userId) != String(userId)) {
      return res.status(400).json({
        message: "This is not your file ",
      });
    }

    // Construct the full file path for deletion
    const filePath = path.join(__dirname, "..", "file", fileFind.file);

    // Delete the file from the filesystem
    fs.unlink(filePath, async (err) => {
      if (err) {
        return res.status(500).json({
          message: "Error deleting file",
        });
      }

      //delete record in database
      await FileUpload.findByIdAndDelete(id);

      return res.status(200).json({
        message: "File deleted successfully",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};
