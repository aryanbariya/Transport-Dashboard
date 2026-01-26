import { NextRequest, NextResponse } from 'next/server';
import { get } from '@/lib/axios';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';
        const status = searchParams.get('status');

        let url = `/api/owners/unified?page=${page}&limit=${limit}`;
        if (status && status !== 'all') {
            url += `&status=${status}`;
        }

        // Fetch from the external backend API
        const data = await get(url);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/owners/unified:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
