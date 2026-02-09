import mongoose, { Schema, model, models } from 'mongoose';

const walletSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'ownerModel'
    },
    ownerModel: {
        type: String,
        required: true,
        enum: ['user', 'captain']
    },
    balance: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Wallet = models.wallet || model('wallet', walletSchema);

export default Wallet;
