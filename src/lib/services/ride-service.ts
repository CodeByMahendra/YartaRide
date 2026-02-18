import Ride from '@/models/Ride';
import Pass from '@/models/Pass';
import Settings from '@/models/Settings';
import Referral from '@/models/Referral';
import Wallet from '@/models/Wallet';
import Transaction from '@/models/Transaction';
import * as mapService from '@/lib/maps';
import crypto from 'crypto';

export async function getFare(pickup: string, destination: string, userId: string | null = null) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const distValue = (distanceTime?.distance?.value) ?? 1000;
    const durationValue = (distanceTime?.duration?.value) ?? 300;

    let settings = await Settings.findOne();
    if (!settings) {
        settings = {
            baseFare: { auto: 30, car: 50, moto: 20 },
            perKmRate: { auto: 12, car: 12, moto: 12 },
            perMinuteRate: { auto: 2, car: 3, moto: 1.5 }
        };
    }

    let activePass = null;
    if (userId) {
        activePass = await Pass.findOne({
            user: userId,
            pickup,
            destination,
            status: 'active',
            expiryDate: { $gt: new Date() }
        });
    }

    const fares = {
        auto: activePass ? 0 : Math.round(settings.baseFare.auto + ((distValue / 1000) * settings.perKmRate.auto) + ((durationValue / 60) * settings.perMinuteRate.auto)),
        car: activePass ? 0 : Math.round(settings.baseFare.car + ((distValue / 1000) * settings.perKmRate.car) + ((durationValue / 60) * settings.perMinuteRate.car)),
        moto: activePass ? 0 : Math.round(settings.baseFare.moto + ((distValue / 1000) * settings.perKmRate.moto) + ((durationValue / 60) * settings.perMinuteRate.moto))
    };

    return {
        fares,
        distance: distanceTime.distance,
        duration: distanceTime.duration,
        route: distanceTime.route || null,
        passUsed: !!activePass
    };
}

export function generateOtp(num: number) {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

export async function createRide({
    user, pickup, destination, pickupLocation, destinationLocation, vehicleType, isFemaleOnly, waitAtDestination
}: any) {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    // Use coordinates for fare calculation if available for better accuracy
    const farePickup = pickupLocation ? `${pickupLocation.ltd},${pickupLocation.lng}` : pickup;
    const fareDestination = destinationLocation ? `${destinationLocation.ltd},${destinationLocation.lng}` : destination;

    const fareData = await getFare(farePickup, fareDestination, user);

    const activePass = await Pass.findOne({
        user,
        pickup,
        destination,
        status: 'active',
        expiryDate: { $gt: new Date() }
    });

    const ride = await Ride.create({
        user,
        pickup, // Human readable address string
        destination, // Human readable address string
        pickupLocation, // Coordinates for map/routing
        destinationLocation, // Coordinates for map/routing
        otp: generateOtp(4),
        fare: (fareData.fares as any)[vehicleType],
        passUsed: !!activePass,
        isFemaleOnly: isFemaleOnly || false,
        waitAtDestination: waitAtDestination || false
    });

    return ride;
}

export async function confirmRide({ rideId, captainId }: { rideId: string, captainId: string }) {
    if (!rideId) throw new Error('Ride id is required');

    const ride = await Ride.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captainId
    }, { new: true }).populate('user').populate('captain').select('+otp');

    if (!ride) throw new Error('Ride not found');

    return ride;
}

export async function startRide({ rideId, otp, captainId }: { rideId: string, otp: string, captainId: string }) {
    if (!rideId || !otp) throw new Error('Ride id and OTP are required');

    const ride = await Ride.findOne({ _id: rideId }).populate('user').populate('captain').select('+otp');
    if (!ride) throw new Error('Ride not found');
    if (ride.status !== 'accepted') throw new Error('Ride not accepted');
    if (ride.otp !== otp) throw new Error('Invalid OTP');

    await Ride.findOneAndUpdate({ _id: rideId }, { status: 'ongoing' });
    return ride;
}

export async function endRide({ rideId, captainId }: { rideId: string, captainId: string }) {
    if (!rideId) throw new Error('Ride id is required');

    const ride = await Ride.findOne({ _id: rideId, captain: captainId }).populate('user').populate('captain');
    if (!ride) throw new Error('Ride not found');
    if (ride.status !== 'ongoing') throw new Error('Ride not ongoing');

    await Ride.findOneAndUpdate({ _id: rideId }, { status: 'completed' });

    // Referral Logic
    const settings = await Settings.findOne();
    if (settings?.referral?.enabled) {
        // User Referral
        const pendingReferral = await Referral.findOne({
            referee: ride.user._id,
            refereeModel: 'user',
            status: 'pending'
        });

        if (pendingReferral) {
            const rewardAmount = settings.referral.userBonus;
            const referrerWallet = await Wallet.findOne({ owner: pendingReferral.referrer, ownerModel: pendingReferral.referrerModel });
            if (referrerWallet) {
                referrerWallet.balance += rewardAmount;
                await referrerWallet.save();
                await Transaction.create({
                    wallet: referrerWallet._id,
                    amount: rewardAmount,
                    type: 'credit',
                    description: `Referral Bonus for inviting ${ride.user.fullname.firstname}`,
                    referenceId: pendingReferral._id
                });
                pendingReferral.status = 'completed';
                pendingReferral.rewardAmount = rewardAmount;
                await pendingReferral.save();
            }
        }

        // Captain Referral
        const captainRidesCount = await Ride.countDocuments({ captain: ride.captain._id, status: 'completed' });
        if (captainRidesCount >= settings.referral.rideThreshold) {
            const pendingCapRef = await Referral.findOne({
                referee: ride.captain._id,
                refereeModel: 'captain',
                status: 'pending'
            });
            if (pendingCapRef) {
                const rewardAmount = settings.referral.captainBonus;
                const referrerWallet = await Wallet.findOne({ owner: pendingCapRef.referrer, ownerModel: pendingCapRef.referrerModel });
                if (referrerWallet) {
                    referrerWallet.balance += rewardAmount;
                    await referrerWallet.save();
                    await Transaction.create({
                        wallet: referrerWallet._id,
                        amount: rewardAmount,
                        type: 'credit',
                        description: `Referral Bonus for inviting captain ${ride.captain.fullname.firstname}`,
                        referenceId: pendingCapRef._id
                    });
                    pendingCapRef.status = 'completed';
                    pendingCapRef.rewardAmount = rewardAmount;
                    await pendingCapRef.save();
                }
            }
        }
    }

    return ride;
}
