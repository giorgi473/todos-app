import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import {
  validateCloudinaryConfig,
  initializeCloudinary,
} from '@/lib/cloudinary';

// Validate configuration on startup
if (!validateCloudinaryConfig()) {
}

// Initialize Cloudinary
initializeCloudinary();

export async function POST(request: NextRequest) {
  try {
    // Verify Cloudinary is configured
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing Cloudinary credentials' },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 },
      );
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'todos-app/todos',
          resource_type: 'auto',
          max_width: 1200,
          max_height: 1200,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.on('error', (error) => {
        reject(error);
      });

      uploadStream.end(buffer);
    });

    const uploadResult = result as any;

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    // Return more specific error based on the error type
    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Cloudinary authentication failed. Check API credentials.' },
        { status: 401 },
      );
    }

    if (errorMessage.includes('timeout')) {
      return NextResponse.json(
        { error: 'Upload timed out. Please try again.' },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: `Failed to upload image: ${errorMessage}` },
      { status: 500 },
    );
  }
}
