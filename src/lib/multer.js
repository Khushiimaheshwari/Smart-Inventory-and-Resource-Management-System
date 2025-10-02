import multer from "multer";
import path from "path";

// store in /uploads folder locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "DP_uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });
