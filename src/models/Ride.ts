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
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
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
    }
}, {
    timestamps: true
});

const Ride = models.ride || model('ride', rideSchema);

export default Ride;
