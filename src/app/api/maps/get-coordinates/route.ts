import { NextRequest, NextResponse } from 'next/server';
import { getAddressCoordinate } from '@/lib/maps';
import { getUserFromToken, getCaptainFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromToken(req);
        const captain = await getCaptainFromToken(req);

        if (!user && !captain) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const address = searchParams.get('address');

        if (!address) {
            return NextResponse.json({ message: 'Address is required' }, { status: 400 });
        }

        const coordinates = await getAddressCoordinate(address);
        return NextResponse.json(coordinates);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
