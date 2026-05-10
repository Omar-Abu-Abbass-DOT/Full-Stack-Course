import { v2 as cloudinary } from "cloudinary";
import { requireAuth } from "@/lib/authMiddleware";
import { created, fail, serverError } from "@/lib/apiHelpers";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_BASE64_BYTES = 5 * 1024 * 1024 * 1.4;
const ALLOWED_MIME = /^data:image\/(png|jpe?g|webp|gif);base64,/i;

export async function POST(request) {
  try {
    const { error } = requireAuth(request);
    if (error) return error;

    const { image } = await request.json();

    if (!image || typeof image !== "string") {
      return fail("Image is required");
    }

    if (!ALLOWED_MIME.test(image)) {
      return fail("Only image/png, jpeg, webp or gif data URLs are allowed");
    }

    if (image.length > MAX_BASE64_BYTES) {
      return fail("Image exceeds the 5MB size limit", 413);
    }

    const upload = await cloudinary.uploader.upload(image, {
      folder: "osta-services",
      resource_type: "image",
    });

    return created({
      message: "Image uploaded successfully",
      url: upload.secure_url,
      publicId: upload.public_id,
    });
  } catch (error) {
    return serverError(error, "Upload failed");
  }
}
