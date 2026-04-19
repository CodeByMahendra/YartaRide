import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
    try {
        // Auth check
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };

        await connectDB();
        const user = await User.findById(decoded._id);
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        // Get base64 image from body
        const { imageBase64 } = await req.json();
        if (!imageBase64) {
            return NextResponse.json({ message: 'No image provided' }, { status: 400 });
        }

        // Validate it's an image
        if (!imageBase64.startsWith('data:image/')) {
            return NextResponse.json({ message: 'Invalid image format' }, { status: 400 });
        }

        // Check size (~5MB max — base64 is ~1.33x actual size)
        const sizeInBytes = (imageBase64.length * 3) / 4;
        if (sizeInBytes > 5 * 1024 * 1024) {
            return NextResponse.json({ message: 'Image too large (max 5MB)' }, { status: 400 });
        }

        // Delete old avatar from Cloudinary if exists
        if (user.profileImage && user.profileImage.includes('cloudinary.com')) {
            try {
                // Extract public_id from URL
                const parts = user.profileImage.split('/');
                const uploadIdx = parts.indexOf('upload');
                if (uploadIdx !== -1) {
                    // Skip version segment (v12345) if present
                    const afterUpload = parts.slice(uploadIdx + 1);
                    const versionSkipped = afterUpload[0]?.startsWith('v') ? afterUpload.slice(1) : afterUpload;
                    const publicId = versionSkipped.join('/').replace(/\.[^/.]+$/, '');
                    await deleteFromCloudinary(publicId);
                }
            } catch (_) {
                // Non-fatal: old image deletion failure shouldn't block upload
            }
        }

        // Upload to Cloudinary
        const { url } = await uploadToCloudinary(imageBase64, 'yatraride/avatars', [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
        ]);

        // Save to DB
        user.profileImage = url;
        await user.save();

        return NextResponse.json({ profileImage: url, message: 'Avatar updated successfully' });
    } catch (err: any) {
        console.error('[upload-avatar]', err);
        return NextResponse.json({ message: 'Upload failed', error: err.message }, { status: 500 });
    }
}
