import { NextRequest, NextResponse } from 'next/server';
import { patch } from '@/lib/axios';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const { uuid } = await params;

        // Call the backend API to toggle status
        // Use an empty body as per typical toggle implementations, or check if backend requires specific body
        const data = await patch(`/api/drivers/${uuid}/status`, {});

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in PATCH /api/drivers/[uuid]/status:', error);
        return NextResponse.json(
            { error: 'Failed to update driver status' },
            { status: 500 }
        );
    }
}
