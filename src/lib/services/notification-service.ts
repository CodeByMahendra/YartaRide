import Notification from '@/models/Notification';
import connectToDb from '@/lib/db';

export async function createNotification({
    recipient,
    recipientModel,
    title,
    message,
    type = 'system'
}: {
    recipient: string;
    recipientModel: 'user' | 'captain';
    title: string;
    message: string;
    type?: 'auth' | 'ride' | 'payment' | 'referral' | 'system';
}) {
    try {
        await connectToDb();
        const notification = await Notification.create({
            recipient,
            recipientModel,
            title,
            message,
            type
        });

        // Optionally, if Socket.io is configured, emit an event here
        const io = (global as any).io;
        if (io) {
            io.to(recipient.toString()).emit('new-notification', notification);
        }

        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
}
