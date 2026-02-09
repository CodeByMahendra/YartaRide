import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import Wallet from '@/models/Wallet';
import Ride from '@/models/Ride';
import connectToDb from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        await connectToDb();
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        // Get Wallet
        const wallet = await Wallet.findOne({ owner: user._id, ownerModel: 'user' });

        // Get Stats
        const rideCount = await Ride.countDocuments({ user: user._id, status: 'completed' });

        return NextResponse.json({
            user,
            wallet: wallet || { balance: 0 },
            stats: { rideCount }
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
