import { v2 as cloudinary } from 'cloudinary';

/**
 * Initialize Cloudinary with environment variables
 * Required env vars:
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 */
export const initializeCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
};

/**
 * Validate that all required Cloudinary environment variables are set
 */
export const validateCloudinaryConfig = (): boolean => {
  const required = [
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  return required.every((key) => {
    if (!process.env[key]) {
      return false;
    }
    return true;
  });
};

/**
 * Delete an image from Cloudinary by public ID
 */
export const deleteCloudinaryImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};
