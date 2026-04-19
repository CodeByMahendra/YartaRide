import { NextRequest, NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import User from '@/models/User';
import Captain from '@/models/Captain';
import { verifyJwtToken } from '@/lib/auth';
import { createNotification } from '@/lib/services/notification-service';

export async function POST(req: NextRequest) {
    try {
        await connectToDb();

        // Get token from cookie or header
        const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyJwtToken(token);
        if (!decoded) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const body = await req.json();
        const { role, fullname, gender, email, vehicle, referredByCode } = body;

        if (!fullname?.firstname) {
            return NextResponse.json({ message: 'First name is required' }, { status: 400 });
        }

        if (role === 'captain') {
            // Validate captain-specific fields
            if (!vehicle?.color || !vehicle?.plate || !vehicle?.vehicleType) {
                return NextResponse.json({ message: 'Vehicle details are required for captains' }, { status: 400 });
            }

            const captain = await Captain.findById(decoded._id);
            if (!captain) {
                return NextResponse.json({ message: 'Captain not found' }, { status: 404 });
            }

            // Update captain profile
            captain.fullname = {
                firstname: fullname.firstname,
                lastname: fullname.lastname || ''
            };
            captain.gender = gender || 'others';
            if (email) captain.email = email;
            captain.vehicle = {
                color: vehicle.color,
                plate: vehicle.plate,
                vehicleType: vehicle.vehicleType,
                capacity: vehicle.capacity || (vehicle.vehicleType === 'moto' ? 1 : vehicle.vehicleType === 'auto' ? 3 : 4)
            };
            captain.isProfileComplete = true;
            await captain.save();

            await createNotification({
                recipient: captain._id.toString(),
                recipientModel: 'captain',
                title: 'Duty Profile Initialized',
                message: 'Your YatraRide captain profile is complete. You can now accept rides!',
                type: 'auth'
            });

            return NextResponse.json({ captain, message: 'Profile completed successfully' }, { status: 200 });
        } else {
            // User profile completion
            const user = await User.findById(decoded._id);
            if (!user) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }

            user.fullname = {
                firstname: fullname.firstname,
                lastname: fullname.lastname || ''
            };
            user.gender = gender || 'male';
            if (email) user.email = email;
            user.isProfileComplete = true;

            if (!user.referralCode) {
                const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
                user.referralCode = `${fullname.firstname.substring(0, 3).toUpperCase()}${randomStr}`;
            }

            if (referredByCode && !user.referredBy) {
                const referrer = await User.findOne({ referralCode: referredByCode });
                if (referrer) {
                    user.referredBy = referrer._id.toString();
                    user.freeRides = (user.freeRides || 0) + 2; 
                }
            }

            await user.save();

            await createNotification({
                recipient: user._id.toString(),
                recipientModel: 'user',
                title: 'Welcome to YatraRide!',
                message: 'Your profile has been completed automatically.',
                type: 'auth'
            });

            if (user.referredBy) {
                await createNotification({
                    recipient: user._id.toString(),
                    recipientModel: 'user',
                    title: 'Referral Applied',
                    message: `Welcome aboard! You earned 2 free rides via referral.`,
                    type: 'referral'
                });
            }

            return NextResponse.json({ user, message: 'Profile completed successfully' }, { status: 200 });
        }
    } catch (error: any) {
        console.error('Complete Profile Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
