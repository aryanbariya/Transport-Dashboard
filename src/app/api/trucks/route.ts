import { NextRequest, NextResponse } from 'next/server';
import { get, post } from '@/lib/axios';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';

        // Fetch from the external backend API
        const data = await get(`/api/trucks?page=${page}&limit=${limit}`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/trucks:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("POST /api/trucks payload:", JSON.stringify(body, null, 2));
        const data = await post('/api/trucks', body);
        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error('Error in POST /api/trucks:', error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data || 'Internal server error' },
            { status: 500 }
        );
    }
}
