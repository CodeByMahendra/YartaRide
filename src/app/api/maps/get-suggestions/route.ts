import { NextRequest, NextResponse } from 'next/server';
import { getAutoCompleteSuggestions } from '@/lib/maps';
import { getUserFromToken, getCaptainFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromToken(req);
        const captain = await getCaptainFromToken(req);

        if (!user && !captain) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const input = searchParams.get('input');
        const ltd = searchParams.get('ltd');
        const lng = searchParams.get('lng');

        if (!input) {
            return NextResponse.json({ message: 'Input is required' }, { status: 400 });
        }

        const suggestions = await getAutoCompleteSuggestions(
            input,
            ltd ? parseFloat(ltd) : null,
            lng ? parseFloat(lng) : null
        );
        return NextResponse.json(suggestions);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
