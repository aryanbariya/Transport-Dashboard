import { NextRequest, NextResponse } from 'next/server';
import { put, deleteRequest } from '@/lib/axios';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const body = await request.json();
        const { uuid } = await params;

        const data = await put(`/api/employees/${uuid}`, body);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in PUT /api/employees/[uuid]:', error);
        return NextResponse.json(
            { error: 'Failed to update employee' },
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
        const data = await deleteRequest(`/api/employees/${uuid}`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in DELETE /api/employees/[uuid]:', error);
        return NextResponse.json(
            { error: 'Failed to delete employee' },
            { status: 500 }
        );
    }
}
