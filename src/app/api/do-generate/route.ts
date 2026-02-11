import { NextRequest, NextResponse } from 'next/server';
import { get, post, put } from '@/lib/axios';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';

        // Fetch from the external backend API
        const data = await get(`/api/do?page=${page}&limit=${limit}`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/do-generate:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = await post('/api/do', body);
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/do-generate:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const data = await put('/api/do', body);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in PUT /api/do-generate:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
