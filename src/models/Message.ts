import mongoose, { Schema, model, models } from 'mongoose';

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['user', 'captain']
    },
    receiver: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel'
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['user', 'captain']
    },
    content: {
        type: String,
        required: true
    },
    ride: {
        type: Schema.Types.ObjectId,
        ref: 'ride'
    }
}, { timestamps: true });

const Message = models.message || model('message', messageSchema);

export default Message;
