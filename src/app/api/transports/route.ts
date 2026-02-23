import { NextRequest, NextResponse } from 'next/server';
import { post, put } from '@/lib/axios';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = await post('/api/transports', body);
        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error('Error in POST /api/transports:', error.response?.data || error.message);
        return NextResponse.json(
            { error: typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message || error.message || 'Internal server error' },
            { status: error.response?.status || 500 }
        );
    }
}
