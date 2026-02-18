import { NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import Captain from '@/models/Captain';
import { createCaptain } from '@/lib/services/captain-service';
import Referral from '@/models/Referral';

export async function POST(req: Request) {
    try {
        await connectToDb();
        const body = await req.json();
        const { fullname, email, password, vehicle, referralCode, location } = body;
        let { gender } = body;

        // Basic validation - making gender and capacity optional with defaults
        if (!fullname?.firstname || !email || !password || password.length < 6 || !vehicle?.color || !vehicle?.plate || !vehicle?.vehicleType) {
            return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
        }

        // Set default gender if missing
        if (!gender) gender = 'others';

        // Set default capacity based on vehicle type if missing
        let capacity = vehicle.capacity;
        if (!capacity) {
            if (vehicle.vehicleType === 'moto') capacity = 1;
            else if (vehicle.vehicleType === 'auto') capacity = 3;
            else capacity = 4; // car
        }

        const isCaptainAlready = await Captain.findOne({ email });
        if (isCaptainAlready) {
            return NextResponse.json({ message: 'Captain already exists' }, { status: 400 });
        }

        const hashedPassword = await (Captain as any).hashPassword(password);

        const captain = await createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: capacity, // Use the variable with default logic
            vehicleType: vehicle.vehicleType,
            ltd: location?.ltd || 0,
            lng: location?.lng || 0,
            gender,
            referredBy: referralCode
        });

        if (referralCode) {
            // Check if referrer is a captain or user (prefer captain for captain referrals)
            let referrer = await Captain.findOne({ referralCode });
            let model = 'captain';
            if (!referrer) {
                const User = (await import('@/models/User')).default;
                referrer = await User.findOne({ referralCode });
                model = 'user';
            }

            if (referrer) {
                await Referral.create({
                    referrer: referrer._id,
                    referrerModel: model,
                    referee: captain._id,
                    refereeModel: 'captain',
                    status: 'pending'
                });
            }
        }

        const token = captain.generateAuthToken();

        return NextResponse.json({ token, captain }, { status: 201 });
    } catch (error: any) {
        console.error('Captain Registration Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
