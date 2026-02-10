import { NextRequest, NextResponse } from 'next/server';
import { put, deleteRequest } from '@/lib/axios';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const body = await request.json();
        const { uuid } = await params;

        const data = await put(`/api/mswc/${uuid}`, body);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in PUT /api/mswc/[uuid]:', error);
        return NextResponse.json(
            { error: 'Failed to update MSWC' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const { uuid } = await params;
        const data = await deleteRequest(`/api/mswc/${uuid}`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in DELETE /api/mswc/[uuid]:', error);
        return NextResponse.json(
            { error: 'Failed to delete MSWC' },
            { status: 500 }
        );
    }
}
