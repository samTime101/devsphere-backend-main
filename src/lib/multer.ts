import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "my_app_uploads",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{ quality: "auto", fetch_format: "auto" }],
    } as {
        folder: string;
        allowed_formats: string[];
        transformation: Array<{ quality: string; fetch_format: string }>;
    },
});

const upload = multer({ storage });

export default upload;
