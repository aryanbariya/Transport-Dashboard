import { get } from '@/lib/axios';

export interface CountData {
    ownercount: number;
    employeecount: number;
    mswccount: number;
    godowncount: number;
    truckcount: number;
    schemecount: number;
    packagingcount: number;
    drivercount: number;
    graincount: number;
    categorycount: number;
    lastModifiedOwners: string;
    lastModifiedEmployee: string;
    lastModifiedMSWC: string;
    lastModifiedSubGodown: string;
    lastModifiedTruck: string;
    lastModifiedScheme: string;
    lastModifiedPackaging: string;
    lastModifieddriver: string;
    lastModifiedGrain: string;
    lastModifiedCategory: string;
}

/**
 * Server-side function to fetch row counts directly from the backend API.
 */
export async function getRowCounts(): Promise<CountData | null> {
    try {
        const data = await get<CountData>('/api/getRowCounts');
        return data;
    } catch (error) {
        console.error('Failed to fetch row counts in server component:', error);
        return null;
    }
}
