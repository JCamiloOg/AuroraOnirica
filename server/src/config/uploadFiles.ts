import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage, fileFilter: (_req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/webp") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});