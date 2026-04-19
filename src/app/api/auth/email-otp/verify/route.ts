import { NextRequest, NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import Otp from '@/models/Otp';
import User from '@/models/User';
import Captain from '@/models/Captain';
import { createNotification } from '@/lib/services/notification-service';

export async function POST(req: NextRequest) {
    try {
        await connectToDb();
        const { phone, otp, role } = await req.json();

        if (!phone || !otp || !role) {
            return NextResponse.json({ message: 'Phone, OTP, and Role are required' }, { status: 400 });
        }

        const otpRecord = await Otp.findOne({ phone, role });

        if (!otpRecord) {
            return NextResponse.json({ success: false, message: 'OTP expired or not found' }, { status: 400 });
        }

        if (otpRecord.otp !== otp) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        // OTP is valid. Now check if user exists or create new one
        let accountId = null;
        let token = null;
        let isProfileComplete = false;

        const email = otpRecord.email; // Get email passed during send-otp

        let account = null;

        if (role === 'user') {
            let user = await User.findOne({ phone });
            if (!user) {
                user = await User.create({ phone, email, isProfileComplete: false });
            } else if (!user.email && email) {
                user.email = email;
                await user.save();
            }
            token = user.generateAuthToken();
            accountId = user._id;
            isProfileComplete = user.isProfileComplete;
            account = user;
        } else if (role === 'captain') {
            let captain = await Captain.findOne({ phone });
            if (!captain) {
                captain = await Captain.create({ 
                    phone, 
                    email, 
                    isProfileComplete: false,
                    location: { type: 'Point', coordinates: [0, 0] } 
                });
            } else if (!captain.email && email) {
                captain.email = email;
                await captain.save();
            }
            token = captain.generateAuthToken();
            accountId = captain._id;
            isProfileComplete = captain.isProfileComplete;
            account = captain;
        }

        // Send Login Notification
        if (isProfileComplete) {
            await createNotification({
                recipient: accountId,
                recipientModel: role,
                title: 'New Login Alert',
                message: `You successfully logged into your YatraRide ${role} account.`,
                type: 'auth'
            });
        }

        // Delete OTP after successful verification
        await Otp.deleteMany({ phone, role });

        return NextResponse.json({
            success: true,
            message: 'OTP verified successfully',
            token,
            isProfileComplete,
            [role]: account
        }, { status: 200 });

    } catch (error: any) {
        console.error('Email Verify Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Verification failed' }, { status: 500 });
    }
}
