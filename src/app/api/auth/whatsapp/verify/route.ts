import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import Otp from '@/models/Otp';
import User from '@/models/User';
import Captain from '@/models/Captain';
import Wallet from '@/models/Wallet';
import crypto from 'crypto';

import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        await connectToDb();
        const { phone, otp, role } = await req.json();

        if (!phone || !otp || !role) {
            return NextResponse.json({ message: 'Phone, OTP and role are required' }, { status: 400 });
        }

        // Normalize phone
        let normalizedPhone = phone.replace(/\D/g, '');
        if (normalizedPhone.length === 10) {
            normalizedPhone = '91' + normalizedPhone;
        }

        const otpRecord = await Otp.findOne({ phone: normalizedPhone, otp, role });

        if (!otpRecord) {
            return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 401 });
        }

        await Otp.deleteOne({ _id: otpRecord._id });

        const modelPhone = normalizedPhone.length > 10 ? normalizedPhone.slice(-10) : normalizedPhone;
        const cookieStore = await cookies();

        if (role === 'captain') {
            let captain = await Captain.findOne({ phone: modelPhone });

            if (captain) {
                if (captain.isBlocked) {
                    return NextResponse.json({ message: 'Account blocked' }, { status: 403 });
                }
                const token = captain.generateAuthToken();
                cookieStore.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

                return NextResponse.json({
                    token, captain, isNewUser: false, isProfileComplete: captain.isProfileComplete
                }, { status: 200 });
            } else {
                const referralCode = crypto.randomBytes(3).toString('hex').toUpperCase();
                captain = await Captain.create({
                    phone: modelPhone,
                    gender: 'others',
                    referralCode,
                    isProfileComplete: false,
                    location: { type: 'Point', coordinates: [0, 0] }
                });
                await Wallet.create({ owner: captain._id, ownerModel: 'captain' });
                const token = captain.generateAuthToken();
                cookieStore.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

                return NextResponse.json({
                    token, captain, isNewUser: true, isProfileComplete: false
                }, { status: 201 });
            }
        } else {
            let user = await User.findOne({ phone: modelPhone });

            if (user) {
                if (user.isBlocked) {
                    return NextResponse.json({ message: 'Account blocked' }, { status: 403 });
                }
                const token = user.generateAuthToken();
                cookieStore.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

                return NextResponse.json({
                    token, user, isNewUser: false, isProfileComplete: user.isProfileComplete
                }, { status: 200 });
            } else {
                const referralCode = crypto.randomBytes(3).toString('hex').toUpperCase();
                user = await User.create({
                    phone: modelPhone,
                    gender: 'others',
                    referralCode,
                    isProfileComplete: false,
                });
                await Wallet.create({ owner: user._id, ownerModel: 'user' });
                const token = user.generateAuthToken();
                cookieStore.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

                return NextResponse.json({
                    token, user, isNewUser: true, isProfileComplete: false
                }, { status: 201 });
            }
        }

    } catch (error: any) {
        console.error('❌ WhatsApp Verify Error Details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            errors: error.errors // For mongoose validation errors
        });
        return NextResponse.json({
            message: 'Internal Server Error',
            error: error.message,
            details: error.errors ? Object.keys(error.errors) : undefined
        }, { status: 500 });
    }
}
