import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import User from '@/models/User';
import { createUser } from '@/lib/services/user-service';
import Referral from '@/models/Referral';

export async function POST(req: Request) {
    try {
        await connectToDb();
        const body = await req.json();
        const { fullname, email, password, gender, referralCode } = body;

        if (!fullname?.firstname || !email || !password || password.length < 6 || !gender) {
            return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
        }

        const isUserAlready = await User.findOne({ email });
        if (isUserAlready) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await (User as any).hashPassword(password);

        const user = await createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            gender,
            referredBy: referralCode
        });

        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                await Referral.create({
                    referrer: referrer._id,
                    referrerModel: 'user',
                    referee: user._id,
                    refereeModel: 'user',
                    status: 'pending'
                });
            }
        }

        const token = user.generateAuthToken();

        return NextResponse.json({ token, user }, { status: 201 });
    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
