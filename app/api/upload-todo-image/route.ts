import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import {
  validateCloudinaryConfig,
  initializeCloudinary,
} from '@/lib/cloudinary';

// Initialize Cloudinary
initializeCloudinary();

export async function POST(request: NextRequest) {
  try {
    // Verify Cloudinary is configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials:', {
        cloudName: !!cloudName,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret,
      });
      return NextResponse.json(
        {
          error:
            'Server configuration error: Missing Cloudinary credentials. Check Vercel environment variables.',
        },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size (10MB max)
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 10) {
      return NextResponse.json(
        {
          error: `File size must be less than 10MB. Current: ${fileSizeInMB.toFixed(2)}MB`,
        },
        { status: 400 },
      );
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Please select an image file' },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using buffer (more reliable for serverless)
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
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result?.public_id);
            resolve(result);
          }
        },
      );

      uploadStream.on('error', (error) => {
        console.error('Upload stream error:', error);
        reject(error);
      });

      // Write buffer to stream
      uploadStream.write(buffer);
      uploadStream.end();
    });

    const uploadResult = result as any;

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    console.error('Upload route error:', errorMessage, error);

    // Return specific error messages based on the error type
    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json(
        {
          error:
            'Cloudinary authentication failed. Verify API credentials on Vercel.',
        },
        { status: 401 },
      );
    }

    if (errorMessage.includes('timeout')) {
      return NextResponse.json(
        { error: 'Upload timed out. Please try again with a smaller image.' },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: `Failed to upload image: ${errorMessage}` },
      { status: 500 },
    );
  }
}
