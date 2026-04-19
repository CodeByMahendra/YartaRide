import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import Otp from '@/models/Otp';
import { sendWhatsAppOTP } from '@/lib/services/whatsapp-service';

export async function POST(req: Request) {
    try {
        await connectToDb();
        const { phone, role } = await req.json();

        if (!phone || !role) {
            return NextResponse.json({ message: 'Phone and role are required' }, { status: 400 });
        }

        // Normalize phone (ensure it has 91 prefix for India if 10 digits)
        let normalizedPhone = phone.replace(/\D/g, '');
        if (normalizedPhone.length === 10) {
            normalizedPhone = '91' + normalizedPhone;
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB (upsert)
        await Otp.findOneAndUpdate(
            { phone: normalizedPhone, role },
            { otp: otpCode, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // Send via WhatsApp
        await sendWhatsAppOTP(normalizedPhone, otpCode);

        return NextResponse.json({
            message: 'OTP sent successfully via WhatsApp',
            debug: process.env.NODE_ENV === 'development' ? `OTP is ${otpCode}` : undefined
        }, { status: 200 });

    } catch (error: any) {
        console.error('WhatsApp Send Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
