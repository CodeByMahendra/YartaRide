import { NextRequest, NextResponse } from 'next/server';
import { getAuthEntity } from '@/lib/auth';
import Notification from '@/models/Notification';
import connectToDb from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        await connectToDb();
        const auth = await getAuthEntity(req);
        if (!auth) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const notifications = await Notification.find({
            recipient: auth.entity._id,
        }).sort({ createdAt: -1 }).limit(50);

        const unreadCount = await Notification.countDocuments({
            recipient: auth.entity._id,
            isRead: false
        });

        return NextResponse.json({ notifications, unreadCount }, { status: 200 });
    } catch (error: any) {
        console.error('Get Notifications Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await connectToDb();
        const auth = await getAuthEntity(req);
        if (!auth) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Mark all as read
        await Notification.updateMany(
            { recipient: auth.entity._id, isRead: false },
            { $set: { isRead: true } }
        );

        return NextResponse.json({ message: 'Marked all as read' }, { status: 200 });
    } catch (error: any) {
        console.error('Update Notifications Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
