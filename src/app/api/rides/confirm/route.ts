import { NextRequest, NextResponse } from 'next/server';
import { getCaptainFromToken } from '@/lib/auth';
import { confirmRide } from '@/lib/services/ride-service';
import connectToDb from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        await connectToDb();
        const captain = await getCaptainFromToken(req);
        if (!captain) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { rideId } = await req.json();

        if (!rideId) {
            return NextResponse.json({ message: 'Ride ID is required' }, { status: 400 });
        }

        const ride = await confirmRide({ rideId, captainId: captain._id });
        return NextResponse.json(ride, { status: 200 });
    } catch (error: any) {
        console.error('Confirm Ride Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
