import { NextRequest, NextResponse } from 'next/server';
import { getCaptainFromToken } from '@/lib/auth';
import { endRide } from '@/lib/services/ride-service';
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

        const ride = await endRide({ rideId, captainId: captain._id });

        // Emit ride-ended event via Socket.IO
        const io = (global as any).io;
        if (io) {
            io.to(ride.user._id.toString()).emit('ride-ended', ride);
        }

        return NextResponse.json(ride, { status: 200 });
    } catch (error: any) {
        console.error('End Ride Error:', error);
        return NextResponse.json({ message: error.message || 'Error ending ride' }, { status: 500 });
    }
}
