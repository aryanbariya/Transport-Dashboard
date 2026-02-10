import { NextRequest, NextResponse } from 'next/server';
import { put, deleteRequest } from '@/lib/axios';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const body = await request.json();
        const { uuid } = await params;

        const data = await put(`/api/schemes/${uuid}`, body);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in PUT /api/schemes/[uuid]:', error);
        return NextResponse.json(
            { error: 'Failed to update scheme' },
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
        const data = await deleteRequest(`/api/schemes/${uuid}`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in DELETE /api/schemes/[uuid]:', error);
        return NextResponse.json(
            { error: 'Failed to delete scheme' },
            { status: 500 }
        );
    }
}
