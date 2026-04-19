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
    contentType: {
        type: String,
        enum: ['text', 'image', 'location', 'voice'],
        default: 'text'
    },
    mediaUrl: {
        type: String // Cloudinary/Storage URL for images or voice notes
    },
    locationData: {
        lat: Number,
        lng: Number,
        address: String
    },
    ride: {
        type: Schema.Types.ObjectId,
        ref: 'ride'
    }
}, { timestamps: true });

if (models.message) {
    delete (mongoose as any).models.message;
}
const Message = model('message', messageSchema);

export default Message;
