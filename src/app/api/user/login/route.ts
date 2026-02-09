import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await connectToDb();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        if (user.isBlocked) {
            return NextResponse.json({ message: 'Your account has been blocked.' }, { status: 403 });
        }

        const token = user.generateAuthToken();

        const response = NextResponse.json({ token, user }, { status: 200 });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
