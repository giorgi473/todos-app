/**
 * Utility functions for handling older base64 profile images
 */

/**
 * Check if a string is a base64 encoded image
 */
export function isBase64Image(str: string): boolean {
  if (!str) return false;
  return str.startsWith('data:image/');
}

/**
 * Parse base64 data to get the mime type and data
 * @param base64String - Base64 encoded image
 * @returns Object with mimeType and base64Data
 */
export function parseBase64Image(base64String: string) {
  const match = base64String.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;

  return {
    mimeType: match[1],
    base64Data: match[2],
  };
}

/**
 * Convert base64 image to File object for uploading to Cloudinary
 * @param base64String - Base64 encoded image
 * @param filename - Name for the new file
 * @returns File object or null if conversion fails
 */
export function base64ToFile(
  base64String: string,
  filename: string = 'image.jpg',
): File | null {
  const parsed = parseBase64Image(base64String);
  if (!parsed) return null;

  try {
    const bstr = atob(parsed.base64Data);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: parsed.mimeType });
  } catch (error) {
    return null;
  }
}

/**
 * Migration helper: Check if user has old base64 profile image
 */
export function userHasBase64ProfileImage(
  profileImage: string | null,
): boolean {
  if (!profileImage) return false;
  return isBase64Image(profileImage);
}
