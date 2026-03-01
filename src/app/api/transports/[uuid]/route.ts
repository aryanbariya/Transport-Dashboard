import { NextRequest, NextResponse } from 'next/server';
import { put } from '@/lib/axios';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const { uuid } = await params;
        const body = await request.json();

        const data = await put(`/api/transports/${uuid}`, body);

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        const { uuid } = await params;
        console.error(`Error in PUT /api/transports/${uuid}:`, error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data || 'Internal server error' },
            { status: 500 }
        );
    }
}
