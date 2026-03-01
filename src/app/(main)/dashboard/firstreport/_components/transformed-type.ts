import type { FirstReport } from "./schema";

export interface TransformedFirstReport extends FirstReport {
    godowns: string[];
    vahtuks: string[];
    quantities: string[];
}
