import mongoose, { Schema, model, models } from 'mongoose';

const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'recipientModel'
    },
    recipientModel: {
        type: String,
        required: true,
        enum: ['user', 'captain']
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['auth', 'ride', 'payment', 'referral', 'system'],
        default: 'system'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = models.notification || model('notification', notificationSchema);

export default Notification;
