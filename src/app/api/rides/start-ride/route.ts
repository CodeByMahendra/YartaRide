import { NextRequest, NextResponse } from 'next/server';
import { getCaptainFromToken } from '@/lib/auth';
import { startRide } from '@/lib/services/ride-service';
import connectToDb from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        await connectToDb();
        const captain = await getCaptainFromToken(req);
        if (!captain) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const rideId = searchParams.get('rideId');
        const otp = searchParams.get('otp');

        if (!rideId || !otp) {
            return NextResponse.json({ message: 'Ride ID and OTP are required' }, { status: 400 });
        }

        const ride = await startRide({ rideId, otp, captainId: captain._id });

        // Emit ride-started event via Socket.IO
        const io = (global as any).io;
        if (io) {
            io.to(ride.user._id.toString()).emit('ride-started', ride);
        }

        return NextResponse.json(ride, { status: 200 });
    } catch (error: any) {
        console.error('Start Ride Error:', error);
        return NextResponse.json({ message: error.message || 'Verification failed' }, { status: 400 });
    }
}
