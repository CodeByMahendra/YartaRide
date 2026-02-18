import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Message from '@/models/Message';
import { verifyJwtToken } from '@/lib/auth';
import User from '@/models/User';
import Captain from '@/models/Captain';

export async function GET(request: Request) {
    try {
        await connect();
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const token = authHeader.split(' ')[1];
        const decoded = verifyJwtToken(token);
        if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const userId = decoded._id;

        // Fetch all messages involving the current user/captain
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
            .sort({ createdAt: 1 }) // Chronological order (oldest first)
            .populate('sender', 'fullname')
            .populate('receiver', 'fullname');

        // Group messages by conversation partner
        const conversationsMap: any = {};

        messages.forEach((msg: any) => {
            const partnerId = msg.sender._id.toString() === userId ? msg.receiver._id.toString() : msg.sender._id.toString();
            const partnerName = msg.sender._id.toString() === userId ? msg.receiver.fullname : msg.sender.fullname;
            const partnerType = msg.sender._id.toString() === userId ? msg.receiverModel : msg.senderModel;

            // In ascending order, the last message processed for a partner will be the latest one
            conversationsMap[partnerId] = {
                partnerId,
                partnerName,
                partnerType,
                lastMessage: msg.content,
                lastMessageTime: msg.createdAt,
                messages: conversationsMap[partnerId] ? [...conversationsMap[partnerId].messages, msg] : [msg]
            };
        });

        const conversations = Object.values(conversationsMap).sort((a: any, b: any) =>
            new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );

        return NextResponse.json({ conversations });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connect();
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const token = authHeader.split(' ')[1];
        const decoded = verifyJwtToken(token);
        if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { receiverId, receiverModel, content, rideId } = body;

        if (!receiverId || !content) {
            return NextResponse.json({ message: 'Receiver and content required' }, { status: 400 });
        }

        // Determine sender model (this is a bit tricky, but we can check the decoded info or assume based on which login used)
        // Usually, the profile API tells us. For now, let's try to find if sender is User or Captain
        let senderModel = 'user';
        const isCaptain = await Captain.findById(decoded._id);
        if (isCaptain) senderModel = 'captain';

        const newMessage = await Message.create({
            sender: decoded._id,
            senderModel,
            receiver: receiverId,
            receiverModel,
            content,
            ride: rideId
        });

        // Emit socket event if needed (socket is global in server.js but not easily accessible here in Next.js edge/api)
        // We'll rely on global.io if available
        if ((global as any).io) {
            (global as any).io.to(receiverId).emit('new-message', newMessage);
        }

        return NextResponse.json({ message: newMessage });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
