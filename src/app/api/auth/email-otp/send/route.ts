import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDb from '@/lib/db';
import Otp from '@/models/Otp';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        await connectToDb();
        const { phone, email, role } = await req.json();

        if (!phone || !email || !role) {
            return NextResponse.json({ message: 'Phone, Email, and Role are required' }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otpValue = crypto.randomInt(100000, 999999).toString();

        // Save OTP to database
        await Otp.findOneAndUpdate(
            { phone, role },
            { otp: otpValue, email, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // Send OTP via Email using Nodemailer
        // NOTE: Uses dummy credentials. In production use ENV variables.
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'yatraride.otp@gmail.com', // Replace with their email later
                pass: process.env.EMAIL_PASS || 'dummy-app-password', // Replace with Google App Password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || 'yatraride.otp@gmail.com',
            to: email,
            subject: 'YatraRide - Your Verification OTP',
            text: `Your OTP for YatraRide login/registration is: ${otpValue}. It is valid for 5 minutes.`,
            html: `
                <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                    <h2>Welcome to YatraRide</h2>
                    <p>Your one-time password (OTP) for verification is:</p>
                    <h1 style="color: #4f46e5; font-size: 32px; letter-spacing: 5px;">${otpValue}</h1>
                    <p>It is valid for 5 minutes. Do not share this code with anyone.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'OTP sent to Email successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Email Send Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to send OTP' }, { status: 500 });
    }
}
