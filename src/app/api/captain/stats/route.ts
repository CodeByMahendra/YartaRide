import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Ride from '@/models/Ride';
import Wallet from '@/models/Wallet';
import { verifyJwtToken } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        await connect();
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const token = authHeader.split(' ')[1];
        const decoded = verifyJwtToken(token);
        if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const captainId = decoded._id;
        const Captain = (await import('@/models/Captain')).default;
        const captain = await Captain.findById(captainId);

        if (!captain) return NextResponse.json({ message: 'Captain not found' }, { status: 404 });

        // Fetch completed rides earnings
        const rides = await Ride.find({ captain: captainId, status: 'completed' });
        const ridesCount = rides.length;
        const totalEarnings = rides.reduce((acc, ride) => acc + (ride.fare || 0), 0);

        // Fetch wallet balance
        const wallet = await Wallet.findOne({ owner: captainId, ownerModel: 'captain' });
        const walletBalance = wallet ? wallet.balance : 0;

        // Dynamic rank based on rides
        let pilotLevel = 1;
        if (ridesCount > 50) pilotLevel = 3;
        else if (ridesCount > 10) pilotLevel = 2;

        return NextResponse.json({
            stats: {
                ridesCount,
                totalEarnings,
                walletBalance,
                hoursOnline: (ridesCount * 0.4).toFixed(1),
                score: "98%",
                rating: captain.rating || 0,
                pilotLevel,
                joinedDate: captain.createdAt
            }
        });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
