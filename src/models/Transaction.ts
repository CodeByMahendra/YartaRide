import mongoose, { Schema, model, models } from 'mongoose';

const transactionSchema = new Schema({
    wallet: {
        type: Schema.Types.ObjectId,
        ref: 'wallet',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    referenceId: {
        type: String // Can be a RideId or ReferralId
    }
}, { timestamps: true });

const Transaction = models.transaction || model('transaction', transactionSchema);
export default Transaction;
