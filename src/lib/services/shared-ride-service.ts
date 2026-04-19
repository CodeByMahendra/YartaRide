import Ride from '@/models/Ride';
import SharedRideGroup from '@/models/SharedRideGroup';
import Captain from '@/models/Captain';
import * as mapService from '@/lib/maps';
import { calculateFare } from './fare-service';

export async function requestSharedRide({
    userId, pickup, destination, pickupLocation, destinationLocation, seatsRequired, vehicleType
}: any) {
    // 1. Calculate fare for shared ride
    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    const { totalFare, breakdown } = await calculateFare(
        distanceTime.distance.value,
        distanceTime.duration.value,
        vehicleType,
        true // isShared
    );

    // 2. Create the ride request
    const ride = await Ride.create({
        user: userId,
        pickup,
        destination,
        pickupLocation: {
            type: 'Point',
            coordinates: [pickupLocation.lng, pickupLocation.lat]
        },
        destinationLocation: {
            type: 'Point',
            coordinates: [destinationLocation.lng, destinationLocation.lat]
        },
        fare: totalFare,
        fareBreakdown: breakdown,
        rideType: 'shared',
        seatsRequired,
        status: 'searching',
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        routePolyline: distanceTime.route // Store initial route
    });

    // 3. Try to find a match
    const match = await findMatch(ride);

    if (match) {
        return { ride, match, status: 'matched' };
    }

    return { ride, status: 'searching' };
}

async function findMatch(newRide: any) {
    const RADIUS_KM = 2;
    // const TIME_WINDOW_MIN = 10;

    // 1. Find other searching shared rides or existing groups with space
    // Optimized with $near query
    const potentialMatches = await Ride.find({
        rideType: 'shared',
        status: 'searching',
        _id: { $ne: newRide._id },
        pickupLocation: {
            $near: {
                $geometry: newRide.pickupLocation,
                $maxDistance: RADIUS_KM * 1000
            }
        }
    }).limit(10);

    for (const otherRide of potentialMatches) {
        // Check direction similarity (Destination similarity)
        const destDistance = calculateDistance(
            newRide.destinationLocation.coordinates[1], newRide.destinationLocation.coordinates[0],
            otherRide.destinationLocation.coordinates[1], otherRide.destinationLocation.coordinates[0]
        );

        // If destinations are also within 5km, it's a good candidate for same direction
        if (destDistance <= 5000) {
            // Potential Match!
            return await createOrJoinGroup(newRide, otherRide);
        }
    }

    return null;
}

async function createOrJoinGroup(ride1: any, ride2: any) {
    // Check if ride2 is already in a group
    let group = await SharedRideGroup.findOne({ 'passengers.rideId': ride2._id, groupStatus: 'searching' });

    if (group) {
        // Join existing group
        if (group.availableSeats >= ride1.seatsRequired) {
            group.passengers.push({
                rideId: ride1._id,
                userId: ride1.user,
                pickupLocation: { lat: ride1.pickupLocation.coordinates[1], lng: ride1.pickupLocation.coordinates[0] },
                dropLocation: { lat: ride1.destinationLocation.coordinates[1], lng: ride1.destinationLocation.coordinates[0] },
                seatsRequired: ride1.seatsRequired
            });
            group.availableSeats -= ride1.seatsRequired;
            await group.save();

            await Ride.findByIdAndUpdate(ride1._id, { status: 'matched' });

            // Notify users via Socket.io
            if ((global as any).io) {
                (global as any).io.to(ride1.user.toString()).emit('ride-matched', { ride: ride1, group });
                // Notify other passengers in the group
                group.passengers.forEach((p: any) => {
                    if (p.userId.toString() !== ride1.user.toString()) {
                        (global as any).io.to(p.userId.toString()).emit('new-passenger-joined', { ride: ride1 });
                    }
                });
                if (group.driverId) {
                    (global as any).io.to(group.driverId.toString()).emit('new-passenger-added', { ride: ride1 });
                }
            }
            return group;
        }
    } else {
        // Create new group
        const newGroup = await SharedRideGroup.create({
            passengers: [
                {
                    rideId: ride1._id,
                    userId: ride1.user,
                    pickupLocation: { lat: ride1.pickupLocation.coordinates[1], lng: ride1.pickupLocation.coordinates[0] },
                    dropLocation: { lat: ride1.destinationLocation.coordinates[1], lng: ride1.destinationLocation.coordinates[0] },
                    seatsRequired: ride1.seatsRequired
                },
                {
                    rideId: ride2._id,
                    userId: ride2.user,
                    pickupLocation: { lat: ride2.pickupLocation.coordinates[1], lng: ride2.pickupLocation.coordinates[0] },
                    dropLocation: { lat: ride2.destinationLocation.coordinates[1], lng: ride2.destinationLocation.coordinates[0] },
                    seatsRequired: ride2.seatsRequired
                }
            ],
            totalSeats: 4,
            availableSeats: 4 - (ride1.seatsRequired + ride2.seatsRequired),
            groupStatus: 'searching'
        });

        await Ride.updateMany({ _id: { $in: [ride1._id, ride2._id] } }, { status: 'matched' });

        // Notify both users
        if ((global as any).io) {
            (global as any).io.to(ride1.user.toString()).emit('ride-matched', { ride: ride1, group: newGroup });
            (global as any).io.to(ride2.user.toString()).emit('ride-matched', { ride: ride2, group: newGroup });
        }
        return newGroup;
    }

    return null;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
