import { NextRequest, NextResponse } from 'next/server';
import Captain from '@/models/Captain';
import connectToDb from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        await connectToDb();
        // In a real app, verify admin session here.

        const { captainId, status } = await req.json();

        if (!captainId || !status) {
            return NextResponse.json({ message: 'Captain ID and status are required' }, { status: 400 });
        }

        const captain = await Captain.findByIdAndUpdate(
            captainId,
            { status },
            { new: true }
        );

        if (!captain) {
            return NextResponse.json({ message: 'Captain not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `Captain ${status} successfully`, captain }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
