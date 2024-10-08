import multer from "multer";
import fs from "fs";

const MulterFileUpload = () => {
  //check file file exists
  if (!fs.existsSync("file")) {
    //not exists yet create it
    fs.mkdirSync("file");
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "file");
    },
    filename: (req, file, cb) => {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    },
  });

  // Return the multer instance with the defined storage configuration
  return multer({ storage: storage });
};

export default MulterFileUpload;
