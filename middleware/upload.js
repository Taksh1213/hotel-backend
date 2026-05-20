import multer from "multer";
import path from "path";
import fs from "fs";

/* ===========================
   CREATE uploads FOLDER IF NOT EXISTS
=========================== */
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ===========================
   STORAGE CONFIG
=========================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

/* ===========================
   FILE FILTER (ONLY IMAGES)
=========================== */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;

  const ext = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

/* ===========================
   MULTER CONFIG
=========================== */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

export default upload;