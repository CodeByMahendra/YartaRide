import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(
    base64Data: string,
    folder: string = 'yatraride/avatars',
    transformations: any[] = [
        { quality: 'auto', fetch_format: 'auto' }
    ]
): Promise<{ url: string; publicId: string }> {
    const result = await cloudinary.uploader.upload(base64Data, {
        folder,
        transformation: transformations,
        resource_type: 'auto' // Important for voice/audio files
    });
    return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteFromCloudinary(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
