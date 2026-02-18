import multer from "multer";

// Memory storage for direct upload to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;