import mongoose, { Schema, model, models } from 'mongoose';

const referralSchema = new Schema({
    referrer: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'referrerModel'
    },
    referrerModel: {
        type: String,
        required: true,
        enum: ['user', 'captain']
    },
    referee: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'refereeModel'
    },
    refereeModel: {
        type: String,
        required: true,
        enum: ['user', 'captain']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'fraud'],
        default: 'pending'
    },
    rewardAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Referral = models.referral || model('referral', referralSchema);

export default Referral;
