import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import Captain from '@/models/Captain';

export async function POST(req: Request) {
    try {
        await connectToDb();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const captain = await Captain.findOne({ email }).select('+password');

        if (!captain) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        const isMatch = await captain.comparePassword(password);

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        if (captain.isBlocked) {
            return NextResponse.json({ message: 'Your account has been blocked.' }, { status: 403 });
        }

        const token = captain.generateAuthToken();

        const response = NextResponse.json({ token, captain }, { status: 200 });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Captain Login Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
