import mongoose, { Schema, model, models } from 'mongoose';

const settingsSchema = new Schema({
    baseFare: {
        car: { type: Number, default: 50 },
        auto: { type: Number, default: 30 },
        moto: { type: Number, default: 20 }
    },
    perKmRate: {
        car: { type: Number, default: 12 },
        auto: { type: Number, default: 12 },
        moto: { type: Number, default: 12 }
    },
    perMinuteRate: {
        car: { type: Number, default: 3 },
        auto: { type: Number, default: 2 },
        moto: { type: Number, default: 1.5 }
    },
    platformCommission: {
        type: Number,
        default: 10 // Percentage
    },
    subscriptionPassEnabled: {
        type: Boolean,
        default: true
    },
    referral: {
        enabled: { type: Boolean, default: true },
        userBonus: { type: Number, default: 50 },
        captainBonus: { type: Number, default: 100 },
        rideThreshold: { type: Number, default: 5 } // Rides a referred captain needs to complete
    }
}, { timestamps: true });

const Settings = models.settings || model('settings', settingsSchema);
export default Settings;
