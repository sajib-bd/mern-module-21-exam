import mongoose from "mongoose";

const fileUploadSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    file: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamp: true }
);

const FileUpload = mongoose.model("files", fileUploadSchema);

export default FileUpload;
