import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (for backend token verification)
// ⚠️ IMPORTANT: Set FIREBASE_SERVICE_ACCOUNT_KEY env variable with the JSON content
// OR place the service account JSON file and reference it here

if (!admin.apps.length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : null;

    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } else {
        // Fallback: Initialize without credentials (for development)
        // In production, always use service account
        console.warn('⚠️ Firebase Admin SDK initialized without service account. Phone verification will not work in production.');
        admin.initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
        });
    }
}

export const adminAuth = admin.auth();
export default admin;
