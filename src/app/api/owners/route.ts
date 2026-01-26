import { NextRequest, NextResponse } from 'next/server';
import { get, post } from '@/lib/axios';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';

        // Fetch from the external backend API
        // baseURL in @/lib/axios is https://pds-transport.onrender.com/
        const data = await get(`/api/owners?page=${page}&limit=${limit}`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/owners:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = await post('/api/owners', body);

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/owners:', error);
        return NextResponse.json(
            { error: 'Failed to create owner' },
            { status: 500 }
        );
    }
}
