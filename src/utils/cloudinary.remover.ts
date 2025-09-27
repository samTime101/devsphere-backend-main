/**
 * @file src/utils/cloudinary.remover.ts
 * @fileOverview Utility to remove images from Cloudinary
 * @author Samip Regmi (samTime101)
 * @date    2024-09-27
 * @since   2024-09-27
 * @requires cloudinary
 * @see {@link https://stackoverflow.com/questions/59346740/how-to-delete-folders-from-cloudinary-media-library}
 */

import cloudinary from "@/lib/cloudinary";

export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // console.log('testing123 public id:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    // console.log("cloudniary result:", result);
    return { success: true };
  } catch (error: any) {
    console.error("error", error);
    return {
      success: false,
      error: error.message || "Delete failed",
    };
  }
};


export const deleteEventFolderFromCloudinary = async (
  folderPath: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // purai remvoe
    // mata ekai choti delete garxa hola vaneko before folder deletion all contents must be deleted
    await cloudinary.api.delete_resources_by_prefix(folderPath);
    const result = await cloudinary.api.delete_folder(folderPath);
    console.log("Cloudinary Folder Deletion Result:", result);
    return { success: true };
  } catch (error: any) {
    console.error("Cloudinary Folder Deletion Error:", error);
    return {
      success: false,
      error: error.message || "Folder deletion failed",
    };
  }
}