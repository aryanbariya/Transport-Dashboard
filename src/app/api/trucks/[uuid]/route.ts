import { NextRequest, NextResponse } from 'next/server';
import { put } from '@/lib/axios';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const { uuid } = await params;
        const body = await request.json();
        const data = await put(`/api/trucks/${uuid}`, body);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in PUT /api/trucks/[uuid]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
