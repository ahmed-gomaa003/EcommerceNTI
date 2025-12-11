import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import Path from "path";
import fs from "fs";
export const fileValidation = {
  images: ["image/png", "image/jpeg", "image/jpg"],
  files: ["application/pdf"],
};
export const upload = (fileType, folder) => {
  // diskstorage
  const storage = diskStorage({
    destination: (req, file, cb) => {
      const folderPath = Path.resolve(".", folder);
      //check if folder exist if not create it
      if (fs.existsSync(folderPath)) {
        return cb(null, folderPath);
      } else {
        fs.mkdirSync(folderPath, { recursive: true });
        const filename = folder;
        cb(null, filename);
      }
    },
    filename: (req, file, cb) => {
      cb(null, nanoid(4, "0123456789") + "_" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (!fileType.includes(file.mimetype))
      return cb(new Error(`only ${fileType} files are allowed`), false);
    cb(null, true);
  };

  const multerUpload = multer({ storage: storage, fileFilter: fileFilter });
  return multerUpload;
};
