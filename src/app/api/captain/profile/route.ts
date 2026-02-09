import { NextRequest, NextResponse } from 'next/server';
import { getCaptainFromToken } from '@/lib/auth';
import Wallet from '@/models/Wallet';
import Ride from '@/models/Ride';
import connectToDb from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        await connectToDb();
        const captain = await getCaptainFromToken(req);
        if (!captain) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        // Get Wallet
        const wallet = await Wallet.findOne({ owner: captain._id, ownerModel: 'captain' });

        // Get Stats
        const rideCount = await Ride.countDocuments({ captain: captain._id, status: 'completed' });

        return NextResponse.json({
            captain,
            wallet: wallet || { balance: 0 },
            stats: { rideCount }
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
