import { NextRequest, NextResponse } from 'next/server';
import { patch } from '@/lib/axios';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const { uuid } = await params;

        // Forward the status toggle request to the external backend
        const data = await patch(`/api/transports/${uuid}/status`);

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        const { uuid } = await params;
        console.error(`Error in PATCH /api/transports/${uuid}/status:`, error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data || 'Internal server error' },
            { status: 500 }
        );
    }
}
