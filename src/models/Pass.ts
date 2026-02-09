import mongoose, { Schema, model, models } from 'mongoose';

const passSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    pickup: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['student', 'office'],
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active'
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Pass = models.pass || model('pass', passSchema);
export default Pass;
