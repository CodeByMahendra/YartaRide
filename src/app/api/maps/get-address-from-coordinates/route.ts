import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, getCaptainFromToken } from '@/lib/auth';
import { getAddressFromCoordinates } from '@/lib/maps';

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromToken(req);
        const captain = await getCaptainFromToken(req);

        if (!user && !captain) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const ltd = searchParams.get('ltd');
        const lng = searchParams.get('lng');

        if (!ltd || !lng) {
            return NextResponse.json({ message: 'Latitude and longitude are required' }, { status: 400 });
        }

        const latitude = parseFloat(ltd);
        const longitude = parseFloat(lng);

        if (isNaN(latitude) || isNaN(longitude)) {
            return NextResponse.json({ message: 'Invalid coordinates' }, { status: 400 });
        }

        const data = await getAddressFromCoordinates(latitude, longitude);
        return NextResponse.json(data, { status: 200 });

    } catch (error: any) {
        console.error('Error in get-address-from-coordinates:', error);
        return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
    }
}
