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

        const userId = decoded._id;

        // Fetch wallet balance
        const wallet = await Wallet.findOne({ owner: userId, ownerModel: 'user' });
        const walletBalance = wallet ? wallet.balance : 0;

        // Fetch total rides and total spent
        const rides = await Ride.find({ user: userId, status: 'completed' });
        const ridesCount = rides.length;
        const totalSpent = rides.reduce((acc: number, ride: any) => acc + (ride.fare || 0), 0);

        return NextResponse.json({
            stats: {
                walletBalance,
                ridesCount,
                totalSpent,
                totalDistance: ridesCount * 5 // Mocking 5km per ride for now
            }
        });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
