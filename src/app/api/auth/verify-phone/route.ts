import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import crypto from 'crypto';

// Firebase Admin - dynamic import to handle missing config gracefully
let adminAuth: any = null;
const getAdminAuth = async () => {
    if (!adminAuth) {
        try {
            const firebaseAdmin = await import('@/lib/firebase-admin');
            adminAuth = firebaseAdmin.adminAuth;
        } catch (e) {
            console.error('Firebase Admin initialization failed:', e);
        }
    }
    return adminAuth;
};

export async function POST(req: Request) {
    try {
        await connectToDb();
        const { idToken, role } = await req.json();
        // role: 'user' or 'captain'

        if (!idToken) {
            return NextResponse.json({ message: 'Firebase ID token is required' }, { status: 400 });
        }

        const auth = await getAdminAuth();
        if (!auth) {
            return NextResponse.json({ message: 'Authentication service not configured' }, { status: 500 });
        }

        // Verify Firebase ID token
        const decodedToken = await auth.verifyIdToken(idToken);
        const { uid, phone_number } = decodedToken;

        if (!phone_number) {
            return NextResponse.json({ message: 'Phone number not found in token' }, { status: 400 });
        }

        // Normalize phone number (remove +91 prefix for storage, keep full for display)
        const normalizedPhone = phone_number.replace(/^\+91/, '');

        if (role === 'captain') {
            // Handle Captain flow
            const Captain = (await import('@/models/Captain')).default;

            // Check if captain exists with this phone or firebaseUid
            let captain = await Captain.findOne({
                $or: [
                    { phone: normalizedPhone },
                    { firebaseUid: uid }
                ]
            });

            if (captain) {
                // Existing captain - Login
                if (captain.isBlocked) {
                    return NextResponse.json({ message: 'Your account has been blocked.' }, { status: 403 });
                }

                // Update firebaseUid if not set
                if (!captain.firebaseUid) {
                    captain.firebaseUid = uid;
                    await captain.save();
                }

                const token = captain.generateAuthToken();
                const response = NextResponse.json({
                    token,
                    captain,
                    isNewUser: false,
                    isProfileComplete: captain.isProfileComplete
                }, { status: 200 });
                response.cookies.set('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                });
                return response;
            } else {
                // New captain - Create minimal account
                const referralCode = crypto.randomBytes(3).toString('hex').toUpperCase();
                captain = await Captain.create({
                    phone: normalizedPhone,
                    firebaseUid: uid,
                    referralCode,
                    isProfileComplete: false,
                    location: {
                        type: 'Point',
                        coordinates: [0, 0]
                    }
                });

                await Wallet.create({
                    owner: captain._id,
                    ownerModel: 'captain'
                });

                const token = captain.generateAuthToken();
                const response = NextResponse.json({
                    token,
                    captain,
                    isNewUser: true,
                    isProfileComplete: false
                }, { status: 201 });
                response.cookies.set('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                });
                return response;
            }
        } else {
            // Handle User flow
            let user = await User.findOne({
                $or: [
                    { phone: normalizedPhone },
                    { firebaseUid: uid }
                ]
            });

            if (user) {
                // Existing user - Login
                if (user.isBlocked) {
                    return NextResponse.json({ message: 'Your account has been blocked.' }, { status: 403 });
                }

                // Update firebaseUid if not set
                if (!user.firebaseUid) {
                    user.firebaseUid = uid;
                    await user.save();
                }

                const token = user.generateAuthToken();
                const response = NextResponse.json({
                    token,
                    user,
                    isNewUser: false,
                    isProfileComplete: user.isProfileComplete
                }, { status: 200 });
                response.cookies.set('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                });
                return response;
            } else {
                // New user - Create minimal account
                const referralCode = crypto.randomBytes(3).toString('hex').toUpperCase();
                user = await User.create({
                    phone: normalizedPhone,
                    firebaseUid: uid,
                    referralCode,
                    isProfileComplete: false,
                });

                await Wallet.create({
                    owner: user._id,
                    ownerModel: 'user'
                });

                const token = user.generateAuthToken();
                const response = NextResponse.json({
                    token,
                    user,
                    isNewUser: true,
                    isProfileComplete: false
                }, { status: 201 });
                response.cookies.set('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                });
                return response;
            }
        }
    } catch (error: any) {
        console.error('Firebase Auth Error:', error);
        if (error.code === 'auth/id-token-expired') {
            return NextResponse.json({ message: 'Token expired. Please try again.' }, { status: 401 });
        }
        if (error.code === 'auth/invalid-id-token') {
            return NextResponse.json({ message: 'Invalid token. Please try again.' }, { status: 401 });
        }
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
