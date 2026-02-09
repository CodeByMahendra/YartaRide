import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getFare } from '@/lib/services/ride-service';
import connectToDb from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        await connectToDb();
        const user = await getUserFromToken(req);
        // We allow get-fare even if unauthorized for guest experience, 
        // but ride-service handles userId for passes if provided.

        const { searchParams } = new URL(req.url);
        const pickup = searchParams.get('pickup');
        const destination = searchParams.get('destination');

        if (!pickup || !destination) {
            return NextResponse.json({ message: 'Pickup and destination are required' }, { status: 400 });
        }

        const fareData = await getFare(pickup, destination, user?._id);
        return NextResponse.json(fareData, { status: 200 });
    } catch (error: any) {
        console.error('Get Fare Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
