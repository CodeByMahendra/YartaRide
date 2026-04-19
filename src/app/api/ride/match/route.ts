import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import SharedRideGroup from '@/models/SharedRideGroup';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { rideId } = await req.json();

        if (!rideId) {
            return NextResponse.json({ error: 'Ride ID is required' }, { status: 400 });
        }

        // Check if the ride has been matched already
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
        }

        if (ride.status === 'matched') {
            const group = await SharedRideGroup.findOne({ 'passengers.rideId': rideId });
            return NextResponse.json({ match: true, group, ride });
        }

        return NextResponse.json({ match: false, status: ride.status });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
