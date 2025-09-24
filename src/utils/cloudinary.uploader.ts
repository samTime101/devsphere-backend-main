import cloudinary from "@/lib/cloudinary";

export const uploadImageToCloudinary = async (
  filePath: string,
  options: { folder?: string } = {}
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: options.folder || "uploads",
      resource_type: "image",
    });

    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    return {
      success: false,
      error: error.message || "Upload failed",
    };
  }
};