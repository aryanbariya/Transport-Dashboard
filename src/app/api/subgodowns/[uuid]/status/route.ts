import { NextRequest, NextResponse } from 'next/server';
import { patch } from '@/lib/axios';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ uuid: string }> }
) {
    try {
        const { uuid } = await params;

        // Proxy the request to the external backend: PATCH /api/subgodowns/:uuid/status
        const data = await patch(`/api/subgodowns/${uuid}/status`);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in PATCH /api/subgodowns/[uuid]/status:', error);
        return NextResponse.json(
            { error: 'Failed to toggle godown status' },
            { status: 500 }
        );
    }
}
