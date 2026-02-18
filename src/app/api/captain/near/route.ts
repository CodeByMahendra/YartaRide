import { NextRequest, NextResponse } from 'next/server';
import connectToDb from '@/lib/db';
import { getCaptainsInTheRadius } from '@/lib/maps';
import { getUserFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectToDb();

        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const ltd = parseFloat(searchParams.get('ltd') || '');
        const lng = parseFloat(searchParams.get('lng') || '');
        const radius = parseFloat(searchParams.get('radius') || '10'); // radius in km

        if (isNaN(ltd) || isNaN(lng)) {
            return NextResponse.json({ message: 'Invalid coordinates' }, { status: 400 });
        }

        const captains = await getCaptainsInTheRadius(ltd, lng, radius);

        return NextResponse.json(captains);
    } catch (error: any) {
        console.error('Error fetching nearby captains:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
