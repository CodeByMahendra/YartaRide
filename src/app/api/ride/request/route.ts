import { NextRequest, NextResponse } from 'next/server';
import { requestSharedRide } from '@/lib/services/shared-ride-service';
import { createRide } from '@/lib/services/ride-service';
import { connectDB } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromToken(req);

        // In a real app, we'd get the user from the session
        // For this demo, we'll allow passing userId or use session if available
        const body = await req.json();
        const { pickup, destination, pickupLocation, destinationLocation, rideType, vehicleType, seatsRequired } = body;

        const userId = user?._id || body.userId;

        if (!userId || !pickup || !destination || !pickupLocation || !destinationLocation) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (rideType === 'shared') {
            const result = await requestSharedRide({
                userId, pickup, destination, pickupLocation, destinationLocation, seatsRequired: seatsRequired || 1, vehicleType
            });
            return NextResponse.json(result);
        } else {
            const ride = await createRide({
                user: userId,
                pickup,
                destination,
                pickupLocation: { ltd: pickupLocation.lat, lng: pickupLocation.lng },
                destinationLocation: { ltd: destinationLocation.lat, lng: destinationLocation.lng },
                vehicleType
            });
            return NextResponse.json({ ride, status: 'searching' });
        }
    } catch (error: any) {
        console.error('Ride Request Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
