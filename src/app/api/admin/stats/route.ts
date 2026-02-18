import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Ride from '@/models/Ride';
import User from '@/models/User';
import Captain from '@/models/Captain';
import { verifyJwtToken } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        await connect();
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const token = authHeader.split(' ')[1];
        const decoded = verifyJwtToken(token);
        if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        // Ensure user is admin
        const adminUser = await User.findById(decoded._id);
        if (adminUser?.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const totalRevenue = await Ride.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$fare' } } }
        ]);

        const activeRiders = await User.countDocuments({ role: 'user' });
        const verifiedCaptains = await Captain.countDocuments({ status: 'active' });
        const ongoingTrips = await Ride.countDocuments({ status: 'ongoing' });

        const recentRides = await Ride.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'fullname')
            .populate('captain', 'fullname');

        const pendingCaptains = await Captain.find({ status: 'inactive' })
            .limit(5);

        return NextResponse.json({
            stats: {
                totalRevenue: totalRevenue[0]?.total || 0,
                activeRiders,
                verifiedCaptains,
                ongoingTrips
            },
            recentRides,
            pendingCaptains
        });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
