import { NextRequest, NextResponse } from 'next/server';
import { getDistanceTime } from '@/lib/maps';
import { getUserFromToken, getCaptainFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromToken(req);
        const captain = await getCaptainFromToken(req);

        if (!user && !captain) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const origin = searchParams.get('origin');
        const destination = searchParams.get('destination');

        if (!origin || !destination) {
            return NextResponse.json({ message: 'Origin and destination are required' }, { status: 400 });
        }

        const distanceTime = await getDistanceTime(origin, destination);
        return NextResponse.json(distanceTime);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
