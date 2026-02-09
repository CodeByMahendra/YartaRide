import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { createRide } from '@/lib/services/ride-service';
import connectToDb from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        await connectToDb();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { pickup, destination, vehicleType, isFemaleOnly, waitAtDestination } = await req.json();

        if (!pickup || !destination || !vehicleType) {
            return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
        }

        const ride = await createRide({
            user: user._id,
            pickup,
            destination,
            vehicleType,
            isFemaleOnly,
            waitAtDestination
        });

        return NextResponse.json(ride, { status: 201 });
    } catch (error: any) {
        console.error('Ride Creation Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
