
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { verifyAdminToken } from '@/lib/auth';

export const runtime = 'nodejs';

// POST /api/upload (admin only)
export async function POST(req: NextRequest) {
  const admin = verifyAdminToken(req);

  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('images').filter(
      (item): item is File => item instanceof File
    );

    if (!files.length) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 images allowed' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
    ];

    const urls = await Promise.all(
      files.map(async (file) => {
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Unsupported image type: ${file.name}`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds the 5MB limit`);
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        return new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'dealership_vehicles',
              resource_type: 'image',
              transformation: [
                { width: 1600, height: 1200, crop: 'limit' },
                { quality: 'auto', fetch_format: 'auto' },
              ],
            },
            (error, result) => {
              if (error || !result) {
                return reject(error || new Error('Upload failed'));
              }

              resolve(result.secure_url);
            }
          );

          stream.end(buffer);
        });
      })
    );

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Cloudinary upload error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : 'Image upload failed',
      },
      { status: 500 }
    );
  }
}
