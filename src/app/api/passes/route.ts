import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import Pass from '@/models/Pass';
import connectToDb from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        await connectToDb();
        const user = await getUserFromToken(req);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { pickup, destination, type, planId } = await req.json();

        if (!pickup || !destination || !type || !planId) {
            return NextResponse.json({ message: 'Pickup, destination, type, and planId are required' }, { status: 400 });
        }

        // Validate plan
        const plans = {
            basic: { price: 299, days: 15 },
            pro: { price: 599, days: 30 },
            elite: { price: 1299, days: 45 }
        };

        const plan = (plans as any)[planId];
        if (!plan) {
            return NextResponse.json({ message: 'Invalid plan selected' }, { status: 400 });
        }

        // Calculate expiry date
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + plan.days);

        const newPass = await Pass.create({
            user: user._id,
            pickup,
            destination,
            type, // 'student' or 'office'
            expiryDate,
            status: 'active',
            price: plan.price
        });

        return NextResponse.json({ message: 'Pass created successfully', pass: newPass }, { status: 201 });
    } catch (error: any) {
        console.error('Create Pass Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDb();
        const user = await getUserFromToken(req);
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const passes = await Pass.find({ user: user._id }).sort({ createdAt: -1 });

        return NextResponse.json({ passes }, { status: 200 });
    } catch (error: any) {
        console.error('Get Passes Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
