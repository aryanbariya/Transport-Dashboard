import axios from 'axios';
import { create } from 'zustand';

interface CountData {
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

interface TransportStore {
    // State
    isLoading: boolean;
    error: string | null;
    CountData: CountData | null;

    // Actions
    fetchGetCount: () => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

export const useTransportStore = create<TransportStore>((set) => ({
    // Initial state
    isLoading: false,
    error: null,
    CountData: null,

    // Actions
    fetchGetCount: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get('/api/get-count');
            set({ CountData: res.data.data, isLoading: false });
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Failed to fetch', isLoading: false });
        }
    },
    setLoading: (isLoading) =>
        set({
            isLoading,
        }),

    setError: (error) =>
        set({
            error,
        }),

    reset: () =>
        set({
            isLoading: false,
            error: null,
            CountData: null,
        }),
}));
