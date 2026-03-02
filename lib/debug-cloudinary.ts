/**
 * Debugging script to check Cloudinary setup
 * Run this in the browser console to diagnose upload issues
 */

export async function debugCloudinaryUpload() {
  // 1. Check .env variables (from public vars)
  const cloudName = (window as any).NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // 2. Test API endpoint
  try {
    const testBlob = new Blob(['test'], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', testBlob);

    const response = await fetch('/api/upload-profile-image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        status: response.status,
        cloudName,
        message: 'API is working',
      };
    } else {
      return {
        success: false,
        status: response.status,
        error: data.error,
        cloudName,
        message: 'API returned error',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      cloudName,
      message: 'API request failed',
    };
  }
}

// Export for manual use in browser console
(window as any).debugCloudinaryUpload = debugCloudinaryUpload;

