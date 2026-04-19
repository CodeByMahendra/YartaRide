import mongoose, { Schema, model, models } from 'mongoose';

const rideSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain: {
        type: Schema.Types.ObjectId,
        ref: 'captain',
    },
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
    rideType: {
        type: String,
        enum: ['private', 'shared'],
        default: 'private',
    },
    seatsRequired: {
        type: Number,
        default: 1,
    },
    matchedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    routePolyline: {
        type: String,
    },
    fareBreakdown: {
        baseFare: Number,
        distanceFare: Number,
        perKmRate: Number,
        discount: Number,
        platformCommission: Number,
    },
    status: {
        type: String,
        enum: ['searching', 'matched', 'accepted', 'ongoing', 'completed', 'cancelled', 'pending'],
        default: 'pending',
    },
    duration: {
        type: Number,
    }, // in seconds
    distance: {
        type: Number,
    }, // in meters
    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    otp: {
        type: String,
        select: false,
        required: true,
    },
    isFemaleOnly: {
        type: Boolean,
        default: false,
    },
    waitAtDestination: {
        type: Boolean,
        default: false,
    },
    isSafeConfirmed: {
        type: Boolean,
        default: false,
    },
    passUsed: {
        type: Boolean,
        default: false,
    },
    pickupLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },
    destinationLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    }
}, {
    timestamps: true
});

rideSchema.index({ pickupLocation: '2dsphere' });
rideSchema.index({ destinationLocation: '2dsphere' });

const Ride = models.ride || model('ride', rideSchema);

export default Ride;
