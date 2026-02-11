import { NextRequest, NextResponse } from 'next/server';
import { get } from '@/lib/axios';

export async function GET(request: NextRequest) {
    try {
        const data = await get('/api/do/next-do');
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/do-generate/next-do:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
