import mongoose, { Schema, model, models } from 'mongoose';

const sharedRideGroupSchema = new Schema({
    driverId: {
        type: Schema.Types.ObjectId,
        ref: 'captain',
    },
    passengers: [{
        rideId: {
            type: Schema.Types.ObjectId,
            ref: 'ride',
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        pickupLocation: {
            lat: Number,
            lng: Number,
        },
        dropLocation: {
            lat: Number,
            lng: Number,
        },
        seatsRequired: Number,
    }],
    totalSeats: {
        type: Number,
        default: 4,
    },
    availableSeats: {
        type: Number,
    },
    optimizedRoute: {
        polyline: String,
        stops: [{
            type: { type: String, enum: ['pickup', 'drop'] },
            location: { lat: Number, lng: Number },
            rideId: { type: Schema.Types.ObjectId, ref: 'ride' }
        }]
    },
    groupStatus: {
        type: String,
        enum: ['searching', 'matched', 'ongoing', 'completed', 'cancelled'],
        default: 'searching',
    }
}, {
    timestamps: true
});

const SharedRideGroup = models.sharedRideGroup || model('sharedRideGroup', sharedRideGroupSchema);

export default SharedRideGroup;
