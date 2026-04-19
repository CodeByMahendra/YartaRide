import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const ride = await Ride.findById(id).populate('captain');
        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
        }

        return NextResponse.json(ride);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
