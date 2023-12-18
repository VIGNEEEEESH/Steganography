const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
};

const fileUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB file size limit
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/images");
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            if (!ext) {
                // If the mimetype is not found in MIME_TYPE_MAP, it means the file is not allowed
                const error = new Error("Invalid mime type");
                cb(error, null);
            } else {
                // Generate a unique filename using UUID and the file extension
                cb(null, uuidv4() + "." + ext);
            }
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        const error = isValid ? null : new Error("Invalid mime type");
        cb(error, isValid);
    },
});

module.exports = fileUpload;
