import { NextRequest, NextResponse } from 'next/server';
import { get } from '@/lib/axios';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';
        const status = searchParams.get('status');
        const active = searchParams.get('active');

        let queryString = `page=${page}&limit=${limit}`;

        if (status) {
            queryString += `&status=${status}`;
        }

        // Handle "active" param if present (legacy or specific use case)
        if (active !== null) {
            queryString += `&active=${active}`;
        }

        // Fetch from the external backend API
        const data = await get(`/api/trucks/unified?${queryString}`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/trucks/unified:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
