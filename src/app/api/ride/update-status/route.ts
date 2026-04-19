import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Ride from '@/models/Ride';
import SharedRideGroup from '@/models/SharedRideGroup';
import User from '@/models/User';
import { createNotification } from '@/lib/services/notification-service';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { rideId, status, captainId } = await req.json();

        if (!rideId || !status) {
            return NextResponse.json({ error: 'Ride ID and Status are required' }, { status: 400 });
        }

        const updateData: any = { status };
        if (captainId) updateData.captain = captainId;

        const ride = await Ride.findByIdAndUpdate(rideId, updateData, { new: true }).populate('user');

        if (!ride) {
            return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
        }

        // Send notification to user about ride status update
        if (ride.user) {
            let msg = `Your ride status is now: ${status}.`;
            if (status === 'accepted') msg = 'A captain has accepted your ride!';
            else if (status === 'ongoing') msg = 'Your ride has started. Enjoy the trip!';
            else if (status === 'completed') msg = 'Your ride has been completed successfully.';

            await createNotification({
                recipient: ride.user._id.toString(),
                recipientModel: 'user',
                title: 'Ride Update',
                message: msg,
                type: 'ride'
            });
        }

        // Handle first ride referral reward
        if (status === 'completed' && ride.user && !ride.user.firstRideCompleted && ride.user.referredBy) {
            const referrer = await User.findById(ride.user.referredBy);
            if (referrer) {
                referrer.freeRides = (referrer.freeRides || 0) + 1;
                await referrer.save();

                // Notify referrer
                await createNotification({
                    recipient: referrer._id.toString(),
                    recipientModel: 'user',
                    title: 'Referral Bonus!',
                    message: 'A friend you referred just completed their first ride! You earned 1 free ride.',
                    type: 'referral'
                });
            }
            await User.findByIdAndUpdate(ride.user._id, { firstRideCompleted: true });
        }

        // If it's a shared ride, update the group status too if needed
        if (ride.rideType === 'shared') {
            const group = await SharedRideGroup.findOne({ 'passengers.rideId': rideId });
            if (group) {
                // Logic to update group status based on passengers
                // For now, just sync if it's ongoing/cancelled
                if (status === 'ongoing' || status === 'cancelled' || status === 'completed') {
                    // Check if all passengers are completed/cancelled...
                }
            }
        }

        return NextResponse.json(ride);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
