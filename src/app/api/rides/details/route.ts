import { NextRequest, NextResponse } from 'next/server';
import Ride from '@/models/Ride';
import connectToDb from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        await connectToDb();
        const { searchParams } = new URL(req.url);
        const rideId = searchParams.get('rideId');

        if (!rideId) {
            return NextResponse.json({ message: 'Ride ID is required' }, { status: 400 });
        }

        const ride = await Ride.findById(rideId).populate('user').populate('captain').select('+otp');
        if (!ride) {
            return NextResponse.json({ message: 'Ride not found' }, { status: 404 });
        }

        return NextResponse.json(ride, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
