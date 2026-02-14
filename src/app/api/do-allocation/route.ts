import { NextRequest, NextResponse } from 'next/server';
import { get } from '@/lib/axios';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';

        const response = await get(`/api/alloc?page=${page}&limit=${limit}`);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in DO Allocation proxy:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
